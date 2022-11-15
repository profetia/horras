<script setup>
import * as d3 from 'd3';
import { d3RefNode } from '@/composables/d3/core/dreactive';
import D3Wrapper from '@/components/d3/core/D3Wrapper.vue';

import { naiveHeatmap } from '@/composables/d3/charts/heatmap';
import { onMounted, watch } from 'vue';
import useHeatmap from '@/composables/charts/useHeatmap';

const props = defineProps({
  width: {
    type: [String, Number],
    default: 1600,
  },
  height: {
    type: [String, Number],
    default: 500,
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
});

const { heatmapData } = useHeatmap(props);

const chart = d3RefNode(() => {
  let scatter = naiveHeatmap(props, heatmapData);
  return scatter.node();
});
</script>
<template>
  <D3Wrapper :node="chart" />
</template>
