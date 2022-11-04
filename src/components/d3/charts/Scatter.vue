<script setup>
import * as d3 from 'd3';
import { computed, defineProps } from 'vue';
import D3Wrapper from '@/components/d3/D3Wrapper.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  width: {
    type: [String, Number],
    default: 800,
  },
  height: {
    type: [String, Number],
    default: 600,
  },
  margin: {
    type: Object,
    default: {
      top: 20,
      right: 30,
      left: 30,
      bottom: 40,
    },
  },
  xType: {
    default: d3.scaleLinear,
  },
  yType: {
    default: d3.scaleLinear,
  },
  xDomain: {
    type: Array,
    default: [0, 1],
  },
  yDomain: {
    type: Array,
    default: [0, 1],
  },
  xLabel: {
    type: String,
    default: '',
  },
  yLabel: {
    type: String,
    default: '',
  },
  scheme: {
    type: Array,
    default: d3.schemeCategory10,
  },
});

const chart = computed(() => {
  const {
    width,
    height,
    margin,
    data,
    xType,
    yType,
    xDomain,
    yDomain,
    xLabel,
    yLabel,
    scheme,
  } = props;

  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  const x = xType.domain(xDomain).range([margin.left, width - margin.right]);
  const y = yType.domain(yDomain).range([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal(
    data.map((d) => d.category),
    scheme,
  );

  const xAxis = (g) =>
    g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', width)
          .attr('y', margin.bottom - 4)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'end')
          .text(xLabel),
      );

  const yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(yLabel),
      );

  const grid = (g) =>
    g
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.1)
      .call((g) =>
        g
          .append('g')
          .selectAll('line')
          .data(x.ticks())
          .join('line')
          .attr('x1', (d) => 0.5 + x(d))
          .attr('x2', (d) => 0.5 + x(d))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom),
      )
      .call((g) =>
        g
          .append('g')
          .selectAll('line')
          .data(y.ticks())
          .join('line')
          .attr('y1', (d) => 0.5 + y(d))
          .attr('y2', (d) => 0.5 + y(d))
          .attr('x1', margin.left)
          .attr('x2', width - margin.right),
      );

  svg.append('g').call(xAxis);
  svg.append('g').call(yAxis);
  svg.append('g').call(grid);

  svg
    .append('g')
    .attr('stroke-width', 1.5)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (d) => x(d.x))
    .attr('cy', (d) => y(d.y))
    .attr('id', (d, id) => `c${id}`)
    .attr('fill', (d) => color(d.category))
    .attr('opacity', 0.7)
    .attr('z-index', 1)
    .attr('r', 3);

  return svg.node();
});
</script>
<template>
  <D3Wrapper :node="chart" />
</template>
