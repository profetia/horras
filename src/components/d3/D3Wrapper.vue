<script setup>
import * as d3 from 'd3';
import { nextTick, ref, watch } from 'vue';
import { getUUID } from '@/composables/utils/uuid';

const props = defineProps({
  chart: {
    type: [Function, Node, d3.selection],
    required: true,
  },
});

const container = ref(null);
const uuid = getUUID();

function mountD3Component() {
  let template = d3
    .create('div')
    .attr('class', 'd3-component')
    .attr('id', `d3-component-${uuid}`);

  if (props.chart instanceof Node) {
    template.append(() => props.chart);
  } else if (props.chart instanceof Function) {
    template.append(() => props.chart());
  } else if (props.chart instanceof d3.selection) {
    template.append(() => props.chart.node());
  }

  container.value.appendChild(template.node());
}

nextTick(() => {
  mountD3Component();
});

watch(
  () => props.chart,
  () => {
    d3.select(`#d3-component-${uuid}`).remove();
    mountD3Component();
  },
);
</script>
<template>
  <div ref="container"></div>
</template>
