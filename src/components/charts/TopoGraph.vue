<script setup>
import * as d3 from 'd3';
import { d3RefNode } from '@/composables/d3/core/dreactive';
import D3Wrapper from '@/components/d3/core/D3Wrapper.vue';

import { topoGraph } from '@/composables/d3/charts/topology';
import { onMounted, watch } from 'vue';
import useTopoGraph from '@/composables/charts/useTopoGraph';

const props = defineProps({
  width: {
    type: [String, Number],
    default: 2400,
  },
  height: {
    type: [String, Number],
    default: 450,
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

const { topoGraphData } = useTopoGraph(props);

const chart = d3RefNode(() => {
  let scatter = topoGraph({
    ...props,
    data: topoGraphData.value,
  });

  return scatter.node();
});
</script>
<template>
  <D3Wrapper :node="chart" />
</template>
