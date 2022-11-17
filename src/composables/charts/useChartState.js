import { reactive, ref } from 'vue';

const timeRange = reactive({
  clockRange: [119, 305],
  dateRange: [0, 1440],
});

const hotspots = ref([]); // locations

const highlights = ref([]); // counties

const setTimeRange = ({ dateRange, clockRange }) => {
  timeRange.clockRange = clockRange;
  timeRange.dateRange = dateRange;
};

const setHotspots = (data) => {
  hotspots.value = data;
};

export default () => {
  return {
    timeRange,
    hotspots,
    highlights,

    setTimeRange,
    setHotspots,
  };
};
