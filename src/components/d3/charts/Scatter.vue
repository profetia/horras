<script setup>
import * as d3 from 'd3';
import { computed, defineProps } from 'vue';
import D3Wrapper from '@/components/d3/D3Wrapper.vue';
import { xAxis, yAxis } from '@/composables/d3/decoration/axis';
import { naiveGrid } from '@/composables/d3/decoration/grid';

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

  svg.append('g').call(
    xAxis(x, {
      posX: 0,
      posY: height - margin.bottom,
      width: width,
      label: xLabel,
      labelX: width,
      labelY: margin.bottom - 4,
    }),
  );

  svg.append('g').call(
    yAxis(y, {
      posX: margin.left,
      posY: 0,
      height: height,
      label: yLabel,
      labelX: -margin.left,
      labelY: 10,
    }),
  );

  svg.append('g').call(
    naiveGrid(x, y, {
      posX1: margin.left,
      posY1: margin.top,
      posX2: width - margin.right,
      posY2: height - margin.bottom,
    }),
  );

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
