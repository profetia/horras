import * as d3 from 'd3';

export function topoGraph({
  data,
  width = 400,
  height = 900,
  margin = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 30,
  },
} = {}) {
  // console.log(data);

  if (!data.nodes || data.nodes.length === 0) {
    return d3.create('svg');
  }

  // process data we obtained
  let nodes = [];
  data.nodes.forEach((element) => {
    nodes.push({
      id: element,
      group: null, //provided by clustering
    });
  });
  let color = (d) => d3.interpolateRdBu(d);
  let links = [];
  for (let i = 0; i < data.edges.length; i++) {
    let weight = data.edges[i].xy_num - data.edges[i].yx_num;
    links.push({
      source: weight ? data.edges[i].x : data.edges[i].y,
      target: weight ? data.edges[i].y : data.edges[i].x,
      weight: Math.abs(weight),
    });
  }
  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // generate the path
  let pathDrawing = (x1, x2, y1, y2) => {
    let dx = 0.25;
    let dy = ((y2 - y1) / (x2 - x1)) * dx;
    let cpx = (0.5 + dx) * x1 + (0.5 - dx) * x2;
    let cpy = 1.2 * ((0.5 + dy) * y1 + (0.5 - dy) * y2);
    const path = d3.path();
    path.moveTo(x1, y1);
    let distence = Math.pow((x1 - x2) ** 2 + (y1 - y2) ** 2, 0.5);
    //path.arcTo(x1, y1, x2, y2, Math.PI / 2)
    path.lineTo(x2, y2);
    // console.log(path.toString());
    return path.toString();
  };
  let pathDrawingForD = (d) => {
    // console.log(d);
    return pathDrawing(d.source.x, d.target.x, d.source.y, d.target.y);
  };

  //split the path so we can reach （渐变）
  let link_split = (d) => {
    let med = [];
    let n = 20;
    let x_minus = (d.target.x - d.source.x) / n;
    let y_minus = (d.target.y - d.source.y) / n;
    for (let i = 0; i < n; i++) {
      med.push({
        source: {
          x: d.source.x + x_minus * i,
          y: d.source.y + y_minus * i,
        },
        target: {
          x: d.source.x + x_minus * (i + 1),
          y: d.source.y + y_minus * (i + 1),
        },
        weight: d.weight,
        index: i / n,
      });
    }
    return med;
  };

  // initialize
  const link = svg
    .selectAll('.lines')
    .data(links)
    .join('g')
    .attr('class', 'lines');
  const node = svg
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .style('fill', '#69b3a2');

  const simulation = d3
    .forceSimulation(nodes) // Force algorithm is applied to data.nodes
    .force(
      'link',
      d3
        .forceLink() // This force provides links between nodes
        .id(function (d) {
          return d.id;
        }) // This provide  the id of a node
        .links(links), // and this the list of links
    )
    .force('charge', d3.forceManyBody().strength(-150)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
    .on('end', ticked);

  function ticked() {
    link
      .selectAll('path')
      .data((d) => link_split(d))
      .join('path')
      .attr('d', (d) => pathDrawingForD(d))
      .attr('stroke-width', (d) => d.weight)
      .attr('stroke', (d, i) => color(d.index))
      .attr('opacity', 0.5)
      .style('stroke-width', (d) => Math.log10(d.weight + 1));
    node
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });
  }
  return svg;
}
