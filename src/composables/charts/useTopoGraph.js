import { onMounted, ref } from 'vue';
import { doPost } from '@/composables/utils/useFetching';

const fetchTopoGraphData = async () => {
  return {
    nodes: [46010701, 46010702, 46010723, 46010708, 46010709, 46010710],
    // all nodes include the chosen and the unchosen
    edges: [
      {
        x: 46010701,
        y: 46010723,
        xy_num: 41,
        yx_num: 27,
      },
      {
        x: 46010701,
        y: 46010708,
        xy_num: 17,
        yx_num: 21,
      },
      {
        x: 46010702,
        y: 46010709,
        xy_num: 9,
        yx_num: 12,
      },
      {
        x: 46010702,
        y: 46010710,
        xy_num: 27,
        yx_num: 48,
      },
    ],
  };
};
const topoGraphData = ref([]);

const processTopoGraphData = async () => {
  let data = await fetchTopoGraphData();
  topoGraphData.value = data;
};

export default () => {
  processTopoGraphData();

  return {
    topoGraphData,
  };
};
