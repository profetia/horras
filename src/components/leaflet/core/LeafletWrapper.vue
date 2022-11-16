<script setup>
import * as d3 from 'd3';
import { nextTick, ref, watch } from 'vue';
import { getUUID } from '@/composables/d3/utils/uuid';

const props = defineProps({
  callback: {
    type: Function,
    required: true,
  },
  args: {
    // Any data that is reactive should be passed in here.
    // Otherwise, the callback will not be re-invoked.
    type: Object,
    default: {},
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 300,
  },
});

const container = ref(null);
const uuid = getUUID();

function mountLeafletComponent() {
  let template = d3
    .create('div')
    .attr('class', 'leaflet-vue-component')
    .attr('id', `leaflet-vue-component-${uuid}`)
    .style('width', `${props.width}px`)
    .style('height', `${props.height}px`);

  container.value.appendChild(template.node());

  props.callback(template.node(), props.args);
}

nextTick(() => {
  mountLeafletComponent();
});

watch(
  () => props.args,
  () => {
    d3.select(`#leaflet-vue-component-${uuid}`).remove();
    mountLeafletComponent();
  },
);
</script>
<template>
  <div ref="container"></div>
</template>
