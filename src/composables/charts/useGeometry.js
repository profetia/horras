import { computed } from 'vue';
import useChartState from '@/composables/charts/useChartState';

const { hotspots } = useChartState();

const geometry = computed(() => {
  if (hotspots.value && hotspots.value.length > 0) {
    const data = hotspots.value.map((hotspot) => ({
      ...hotspot,
      count: hotspot.start_num + hotspot.dest_num,
    }));
    return {
      data,
      // TODO: Adjust threshold
      min: Math.min(...data.map((hotspot) => hotspot.count)),
      max: Math.min(1000, Math.max(...data.map((hotspot) => hotspot.count))),
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
  };
};
