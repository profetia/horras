<script setup>
import { d3RefNode } from '@/composables/d3/core/dreactive';
import D3Wrapper from '@/components/d3/core/D3Wrapper.vue';

import { topoGraph } from '@/composables/d3/charts/topology';
import useTopoGraph from '@/composables/charts/useTopoGraph';
import { toValidLength } from '@/composables/leaflet/utils/layout';

const props = defineProps({
  width: {
    type: [String, Number],
    default: 800,
  },
  height: {
    type: [String, Number],
    default: 588,
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
  <v-card variant="outlined">
    <div
      :style="{ width: toValidLength(width), height: toValidLength(height) }"
    >
      <D3Wrapper :node="chart" />
    </div>
  </v-card>
</template>
