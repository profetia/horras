import { ref, watch } from 'vue';
import useSnackbar from '@/composables/global/useSnackbar';
import { doGet, doPost } from '@/composables/utils/useFetching';
import useChartState from '@/composables/charts/useChartState';

const { showSnackbar } = useSnackbar();
const { timeRange, fetchStatus, setHotspots } = useChartState();

const fetchHeatmapData = async () => {
  let data = [];
  await doGet(
    'heatmap',
    (response) => {
      data = response.data;
    },
    // eslint-disable-next-line no-unused-vars
    (_erorr) => {
      showSnackbar('Error fetching heatmap data', 'error');
    },
  )();
  return data;
};

const fetchHotspots = async () => {
  const dateLowerBound = 119;

  let data = [];
  await doPost(
    'geometry',
    (response) => {
      data = response.data;
      fetchStatus.value = false;
    },
    // eslint-disable-next-line no-unused-vars
    (_erorr) => {
      showSnackbar('Error fetching hotspots data', 'error');
      // console.log(_erorr);
    },
  )({
    date_range: timeRange.dateRange.map((value) => value + dateLowerBound),
    clock_range: timeRange.clockRange.map((value) => value * 60),
  });
  return data;
};

const scaleFunction = (value) => {
  // return Math.exp(value / 1000);
  return value;
};

const heatmapData = ref([]);

const processHeatmap = async () => {
  let data = await fetchHeatmapData();
  // console.log(data);
  data = data[0].map((_, colIndex) => data.map((row) => row[colIndex]));
  data = data.map((row) => row.map((value) => scaleFunction(value)));
  // console.log(data);
  // console.log(data);
  // console.log(data.length);
  heatmapData.value = data;
};

export default () => {
  processHeatmap();

  watch(
    timeRange,
    // eslint-disable-next-line no-unused-vars
    async (_value, _oldValue) => {
      fetchStatus.value = true;
      const hotspots = await fetchHotspots();
      setHotspots(hotspots);
    },
    {
      immediate: true,
    },
  );

  return {
    heatmapData,
  };
};
