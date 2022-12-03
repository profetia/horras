<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { d3RefNode } from '@/composables/d3/core/dreactive';
import D3Wrapper from '@/components/d3/core/D3Wrapper.vue';

import { brushedHeatmap } from '@/composables/d3/charts/heatmap';
import {
  weatherExtension,
  differentialExtension,
} from '@/composables/d3/charts/extension';
import useHeatmap from '@/composables/charts/useHeatmap';

const props = defineProps({
  width: {
    type: [String, Number],
    default: 1700,
  },
  height: {
    type: [String, Number],
    default: 350,
  },
  margin: {
    type: Object,
    default: () => ({
      top: 35,
      right: 100, //留白准备画折线图，不然纯看热力图。。。
      left: 70,
      bottom: 140, //留白准备画折线图，不然纯看热力图。。。
    }),
  },
});

const { heatmapData } = useHeatmap(props);

const chart = d3RefNode(() => {
  let scatter = brushedHeatmap(props, heatmapData);
  scatter = weatherExtension({ svg: scatter, ...props }, heatmapData);
  scatter = differentialExtension({ svg: scatter, ...props }, heatmapData);
  return scatter.node();
});
</script>
<template>
  <D3Wrapper :node="chart" />
</template>
