<script setup>
import { d3RefNode } from '@/composables/d3/core/dreactive';
import D3Wrapper from '@/components/d3/core/D3Wrapper.vue';
import * as d3 from 'd3';
import { topoGraph } from '@/composables/d3/charts/topology';
import useTopoGraph from '@/composables/charts/useTopoGraph';
import useChartState from '@/composables/charts/useChartState';
import { toValidLength } from '@/composables/leaflet/utils/layout';
import { nextTick, watch } from 'vue';

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
const { selected } = useChartState();

const chart = d3RefNode(() => {
  let scatter = topoGraph({
    ...props,
    data: topoGraphData.value,
    selectCallback: (_event, d) => {
      const adcode = d.id;
      selected.value = adcode;
    },
    // eslint-disable-next-line no-unused-vars
    unselectCallback: (_event, _d) => {
      selected.value = 0;
    },
  });

  return scatter.node();
});

watch(chart, (value) => {
  const scatter = d3.select(value);
  scatter.selectAll('circle').each((d, i, g) => {
    if (d.id == selected.value) {
      // console.log('selected', d);
      scatter
        .selectAll('.nodes')
        .attr('opacity', '0.1')
        .attr('isCalled', 'false');
      scatter
        .selectAll('.lines')
        .attr('opacity', '0.1')
        .attr('isCalled', 'false');
      scatter
        .selectAll(`#Topo_node_${d.id}`)
        .attr('opacity', '1')
        .attr('isCalled', 'true');
      scatter
        .selectAll(`.Topo_line_target_${d.id}`)
        .attr('opacity', '1')
        .attr('isCalled', 'false');
      scatter
        .selectAll(`.Topo_line_source_${d.id}`)
        .attr('opacity', '1')
        .attr('isCalled', 'false');
    }
  });
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
