import { reactive, ref } from 'vue';

const timeRange = reactive({
  clockRange: [0, 1440],
  dateRange: [119, 305],
});

const hotspots = ref([]); // locations

const highlights = ref([]); // counties

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

    setTimeRange,
    setHotspots,
    setHighlights,
    appendHighlights,
  };
};
