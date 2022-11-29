import { computed, reactive } from 'vue';
import useChartState from '@/composables/charts/useChartState';

const { hotspots } = useChartState();

const chartConfig = reactive({
  adoptive: false,
  width: 800,
  height: 600,
  layers: ['departures', 'arrivals'],
});

const geometry = computed(() => {
  if (
    hotspots.value &&
    hotspots.value.length > 0 &&
    (chartConfig.layers.includes('departures') ||
      chartConfig.layers.includes('arrivals'))
  ) {
    const data = hotspots.value.map((hotspot) => ({
      ...hotspot,
      count: (() => {
        let res = 0;
        if (chartConfig.layers.includes('departures')) {
          res += hotspot.start_num;
        }
        if (chartConfig.layers.includes('arrivals')) {
          res += hotspot.dest_num;
        }
        if (!chartConfig.adoptive) {
          res = Math.log(res);
        }
        return res;
      })(),
    }));
    return {
      data,
      min: Math.max(0, Math.min(...data.map((hotspot) => hotspot.count))),
      max: Math.max(0, Math.max(...data.map((hotspot) => hotspot.count))),
    };
  } else {
    return {
      data: [],
      min: 0,
      max: 0,
    };
  }
});

export default () => {
  return {
    geometry,
    chartConfig,
  };
};
