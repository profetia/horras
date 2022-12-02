import { ref, watch } from 'vue';
import { doPost } from '@/composables/utils/useFetching';
import useChartState from '@/composables/charts/useChartState';
import useSnackbar from '@/composables/global/useSnackbar';
import { doDebounce } from '@/composables/utils/useDebounce';

const { highlights, timeRange, fetchStatus } = useChartState();
const { showSnackbar } = useSnackbar();

const topoGraphData = ref({
  nodes: [],
  edges: [],
});

const fetchTopoGraphData = async () => {
  const dateLowerBound = 119;

  let data = {};
  await doPost(
    'topology',
    (response) => {
      data.edges = response.data;
      fetchStatus.value = false;
    },
    // eslint-disable-next-line no-unused-vars
    (_erorr) => {
      showSnackbar('Error fetching hotspots data', 'error');
      // console.log(_erorr);
    },
  )({
    nodes: highlights.value,
    date_range: timeRange.dateRange.map((value) => value + dateLowerBound),
    clock_range: timeRange.clockRange.map((value) => value * 60),
  });
  return data;
};

const processTopoGraphData = async () => {
  fetchStatus.value = true;
  let data = await fetchTopoGraphData();
  topoGraphData.value = data;
};

watch(
  highlights,
  doDebounce(() => {
    processTopoGraphData();
  }),
  {
    deep: true,
  },
);

// eslint-disable-next-line no-unused-vars
watch(timeRange, (_value) => {
  if (highlights.value.length > 0) {
    processTopoGraphData();
  }
});

export default () => {
  // processTopoGraphData();

  return {
    topoGraphData,
  };
};
