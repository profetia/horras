<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { d3RefNode } from '@/composables/d3/core/dreactive';
import D3Wrapper from '@/components/d3/core/D3Wrapper.vue';

import { naiveHeatmap } from '@/composables/d3/charts/heatmap';
import useHeatmap from '@/composables/charts/useHeatmap';

const props = defineProps({
  width: {
    type: [String, Number],
    default: 1700,
  },
  height: {
    type: [String, Number],
    default: 250,
  },
  margin: {
    type: Object,
    default: () => ({
      top: 20,
      right: 30,
      left: 30,
      bottom: 40,
    }),
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
