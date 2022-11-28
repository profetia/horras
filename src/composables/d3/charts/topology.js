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

  function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
        `;
  }

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d) => d.id),
    )
    .force('charge', d3.forceManyBody().strength(-20))
    .force('center', d3.forceCenter(width / 2, height / 2).strength(0.5));
  simulation.on('tick', () => {
    link.attr('d', linkArc);
    node.attr('transform', (d) => `translate(${d.x},${d.y})`);
  });
  // .on('end', ticked);

  let drag = (simulation) => {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0.1);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };
  // initialize
  svg
    .append('defs')
    .append('marker')
    .attr('id', `arrow-1`)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', -0.5)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('fill', 'red')
    .attr('orient', 'auto')
    .append('path')

    .attr('d', 'M0,-5L10,0L0,5');
  const link = svg
    .append('g')
    .attr('fill', 'none')

    .selectAll('.lines')
    .data(links)
    .join('path')
    .attr('class', 'lines')
    .style('stroke', 'red')
    .attr('opacity', (d) => d.weight / 10000 + 0.25)
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('marker-end', (d) => `url(${new URL(`#arrow-${1}`, location)})`);
  const node = svg
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('id', (d) => `Topo_Node_${d.id}`)
    .attr('r', 5)
    .style('fill', '#69b3a2')
    .call(drag(simulation));

  return svg;
}
