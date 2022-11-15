import * as d3 from 'd3';
import { xAxis, yAxis } from '@/composables/d3/decoration/axis';
import { naiveGrid } from '@/composables/d3/decoration/grid';

export function naiveHeatmap(
  {
    width = 400,
    height = 900,
    margin = {
      top: 20,
      right: 30,
      bottom: 40,
      left: 30,
    },
    heatmapColor = d3.interpolateRdBu,
  },
  data,
) {
  if (data.value.length === 0) {
    return d3.create('svg');
  }
  const color = d3.scaleSequentialSqrt(
    [0, data.value.length ? d3.max(d3.max(data.value)) : 0],
    heatmapColor,
  );

  const x = d3
    .scaleLinear()
    .domain([0, data.value[0].length])
    .rangeRound([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([0, data.value.length])
    .rangeRound([margin.top, height - margin.bottom]);

  const xAxis = (g) =>
    g
      .call((g) =>
        g
          .append('g')
          .attr('transform', `translate(0,${margin.top})`)
          .call(d3.axisTop(x).ticks(null, 'd'))
          .call((g) => g.select('.domain').remove()),
      )
      .call((g) =>
        g
          .append('g')
          .attr('transform', `translate(0,${width - margin.bottom})`)
          .call(
            d3
              .axisBottom(x)
              .tickValues(d3.range(0, data.value[0].length, 10))
              .tickFormat((x) => x)
              .tickSize(30),
          )
          .call((g) => g.select('.domain').remove()),
      );

  const yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .call((g) => g.select('.domain').remove());

  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  svg.append('g').call(xAxis);

  svg.append('g').call(yAxis);

  svg
    .append('g')
    .selectAll('g')
    .data(data.value)
    .join('g')
    .attr('transform', (d, i) => {
      return `translate(0,${(y(1) * i) / 2})`;
    })
    .selectAll('rect')
    .data((d) => d)
    .join('rect')
    .attr('x', (d, i) => x(i))
    .attr('width', (d, i) => x(i + 1) - x(i) - 1)
    .attr('height', y(1) - y(0) + 1)
    .attr('fill', (d) => color(d));

  return svg;
}
