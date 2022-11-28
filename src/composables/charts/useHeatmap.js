import { ref } from 'vue';
import useSnackbar from '@/composables/global/useSnackbar';
import { doGet, doPost } from '@/composables/utils/useFetching';
import useChartState from '@/composables/charts/useChartState';

const { showSnackbar } = useSnackbar();
const { timeRange, setHotspots } = useChartState();

const fetchHeatmapData = async () => {
  let data = [];
  await doGet(
    'heatmap',
    (response) => {
      data = response.data;
    },
    (_erorr) => {
      showSnackbar('Error fetching heatmap data', 'error');
      console.log(_erorr);
    },
  )();
  return data;
};

const fetchHotspots = async () => {
  let data = [];
  await doPost(
    'geometry',
    (response) => {
      data = response.data;
    },
    (_erorr) => {
      showSnackbar('Error fetching hotspots data', 'error');
      console.log(_erorr);
    },
  )({
    date_range: timeRange.dateRange,
    clock_range: timeRange.clockRange,
  });
  return data;
};

const heatmapData = ref([]);

const processHeatmap = async () => {
  let data = await fetchHeatmapData();
  // console.log(data);
  data = data[0].map((_, colIndex) => data.map((row) => row[colIndex]));
  // console.log(data);
  // console.log(data.length);
  heatmapData.value = data;
  const hotspots = await fetchHotspots();
  setHotspots(hotspots);
};

export default () => {
  processHeatmap();

  return {
    heatmapData,
  };
};
