import { onMounted, ref } from 'vue';
import useFetching from '../utils/useFetching';

const fetchHeatmapData = async () => {
  let data = [];
  await useFetching(
    'heatmap',
    (response) => {
      data = response.data;
    },
    (erorr) => {
      console.log('error');
      console.log(erorr);
    },
  )();
  return data;
};

const heatmapData = ref([]);

const processHeatmap = async () => {
  let data = await fetchHeatmapData();
  console.log(data);
  data = data[0].map((_, colIndex) => data.map((row) => row[colIndex]));
  console.log(data);
  console.log(data.length);
  heatmapData.value = data;
};

export default () => {
  processHeatmap();

  return {
    heatmapData,
  };
};
