import { reactive, ref } from 'vue';

const timeRange = reactive({
  clockRange: [0, 24],
  dateRange: [0, 186],
});

const hotspots = ref([]); // locations

const highlights = ref([]); // counties

const loading = reactive({
  geometry: false,
  topology: false,
});

const setTimeRange = (dateRange, clockRange) => {
  timeRange.clockRange = clockRange;
  timeRange.dateRange = dateRange;
};

const setHotspots = (data) => {
  hotspots.value = data;
};

const setHighlights = (data) => {
  highlights.value = data;
};

const appendHighlights = (data) => {
  highlights.value.push(...data);
};

export default () => {
  return {
    timeRange,
    hotspots,
    highlights,
    loading,

    setTimeRange,
    setHotspots,
    setHighlights,
    appendHighlights,
  };
};
