<script setup>
import D3Wrapper from '@/components/d3/D3Wrapper.vue';
import { computed } from 'vue';
import { ref } from 'vue';
import * as d3 from 'd3';

const cityScheme = (() => {
  const categoriesCount = 42;
  const maxValue = 42;
  return [...Array(categoriesCount)]
    .map((_, i) => {
      const upperBound = (maxValue / categoriesCount) * (i + 1);
      const lowerBound = (maxValue / categoriesCount) * i;
      return d3.interpolateRainbow(upperBound / maxValue);
    })
    .reverse();
})();

function gridRectLegend(
  data,
  {
    rows = 2,
    columns = Math.floor(new Set(data.map((d) => d.category)).size / rows),
    scheme = d3.schemeCategory10,
    rectWidth = 20,
    rectHeight = 20,
    rectMargin = 0,
    textWidth = 120,
    width = columns * (rectWidth + 2 * rectMargin + textWidth),
    height = rows * (rectHeight + 2 * rectMargin),
  } = {},
) {
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
    .attr('font-size', 15)
    .text((d) => d);

  return svg;
}

const data = ref([]);

const legend = computed(() => {
  return gridRectLegend(
    data.value.map((d) => ({
      category: d['city'],
    })),
    {
      scheme: cityScheme,
      rows: 6,
      rectMargin: 5,
      textWidth: 150,
    },
  ).node();
});

const getData = async () => {
  const detailedData = await d3.csv('./static/house_pricing.csv');
  const coordinalData = await d3.csv('./static/house_pricing_normalized.csv');

  data.value = detailedData.map((d, i) => ({
    ...d,
    ...coordinalData[i],
  }));
};

getData();
</script>
<template>
  <div class="v-main">
    <D3Wrapper :chart="legend" />
  </div>
</template>
