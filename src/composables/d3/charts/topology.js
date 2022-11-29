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
      in_number: d3.sum(data.edges, (d) => {
        if (d.x == element) {
          return d.yx_num;
        }
        if (d.y == element) {
          return d.xy_num;
        }
      }),
      out_number: d3.sum(data.edges, (d) => {
        if (d.x == element) {
          return d.xy_num;
        }
        if (d.y == element) {
          return d.yx_num;
        }
      }),
      group: null, //provided by clustering
    });
  });
  nodes.forEach((d) => {
    d.sum_number = d.in_number + d.out_number;
  });

  let node_weight_scale = d3
    .scaleLinear()
    .domain(d3.extent(nodes, (d) => d.sum_number))
    .range([1, 0]);
  nodes.forEach((d) => {
    d.weight = node_weight_scale(d.sum_number);
  });
  let links = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].x == data.edges[i].y) {
      console.log('error on data for Topo');
      continue;
    }
    let weight = data.edges[i].xy_num - data.edges[i].yx_num;
    /*    links.push({
      source: weight ? data.edges[i].x : data.edges[i].y,
      target: weight ? data.edges[i].y : data.edges[i].x,
      weight: Math.abs(weight),
    }); */ //work for linkLine
    links.push({
      source: data.edges[i].x,
      target: data.edges[i].y,
      weight: data.edges[i].xy_num,
    });

    links.push({
      source: data.edges[i].y,
      target: data.edges[i].x,
      weight: data.edges[i].yx_num,
    });
    // work for linkArc
  }

  let color = (d) => d3.interpolateRdYlGn(d);
  let color_scale = d3
    .scaleLinear()
    .domain(d3.extent(links, (d) => d.weight))
    .range([1, 0]);
  links.forEach((d) => {
    d.weight_color = color_scale(d.weight);
  });

  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  let linkArc = (d) => {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
        `;
  };
  let linkLine = (d) => {
    const path = d3.path();
    path.moveTo(d.source.x, d.source.y);
    path.lineTo(d.target.x, d.target.y);
    return path.toString();
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d) => d.id),
    )
    .force('charge', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(width / 2, height / 2).strength(0.7));
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
    .selectAll('defs')
    .data(links)
    .join('defs')
    .append('marker')
    .attr('id', (d) => `Topo_arrow_${d.source.id}_${d.target.id}`)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', -0.5)
    .attr('markerWidth', 3)
    .attr('markerHeight', 5)
    .attr('fill', (d) => color(d.weight_color))

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
    .attr('id', (d) => `Topo_line_${d.source.id}_${d.target.id}`)
    .style('stroke', (d) => color(d.weight_color))
    .attr('stroke-width', 3)
    .attr('fill', 'none')

    .attr(
      'marker-end',
      (d) =>
        `url(${new URL(
          `#Topo_arrow_${d.source.id}_${d.target.id}`,
          location,
        )})`,
    );
  const node = svg
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('id', (d) => `Topo_node_${d.id}`)
    .attr('r', 5)

    .style('fill', (d) => color(d.weight))
    .call(drag(simulation));
  return svg;
}
