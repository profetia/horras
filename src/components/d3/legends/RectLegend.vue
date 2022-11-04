<script setup>
import D3Wrapper from '@/components/d3/D3Wrapper.vue';
import { computed, defineProps } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  rows: {
    type: [Number, String],
    default: 2,
  },
  columns: {
    type: [Number, String],
    default: null,
  },
  scheme: {
    type: Array,
    default: d3.schemeCategory10,
  },
  rectWidth: {
    type: [Number, String],
    default: 20,
  },
  rectHeight: {
    type: [Number, String],
    default: 20,
  },
  rectMargin: {
    type: [Number, String],
    default: 0,
  },
  textWidth: {
    type: [Number, String],
    default: 120,
  },
  width: {
    type: [Number, String],
    default: null,
  },
  height: {
    type: [Number, String],
    default: null,
  },
});

const legend = computed(() => {
  let {
    data,
    rows,
    columns,
    scheme,
    rectWidth,
    rectHeight,
    rectMargin,
    textWidth,
    width,
    height,
  } = props;

  if (columns === null) {
    columns = Math.floor(new Set(data.map((d) => d.category)).size / rows);
  }

  if (width === null) {
    width = columns * (rectWidth + 2 * rectMargin + textWidth);
  }

  if (height === null) {
    height = rows * (rectHeight + 2 * rectMargin);
  }

  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);
  const color = d3.scaleOrdinal(
    data.map((d) => d.category),
    scheme,
  );

  svg
    .selectAll('rect')
    .data(color.domain().slice())
    .join('rect')
    .attr(
      'x',
      (d, i) => (i % columns) * (rectWidth + 2 * rectMargin + textWidth),
    )
    .attr(
      'y',
      (d, i) => Math.floor(i / columns) * (rectHeight + 2 * rectMargin),
    )
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', (d) => color(d));

  svg
    .selectAll('text')
    .data(color.domain().slice())
    .join('text')
    .attr(
      'x',
      (d, i) => (i % columns) * (rectWidth + 2 * rectMargin + textWidth) + 25,
    )
    .attr(
      'y',
      (d, i) => Math.floor(i / columns) * (rectHeight + 2 * rectMargin) + 15,
    )
    .text((d) => d);

  return svg.node();
});
</script>
<template>
  <D3Wrapper :node="legend" />
</template>
