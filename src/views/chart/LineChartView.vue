<template>
  <LineChart :labels="labels" :datasets="datasets" />
  <div class="text-center">
    <!-- <button @click="handleClick">测试</button> -->
  </div>
</template>

<script>
import LineChart from "../../components/LineChart";
import { CHART_COLORS, transparentize } from "../../utils/utils";
import axios from "axios";

function parseUdatetime(udatetime) {
  const date = new Date(udatetime);
  const datetime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return datetime;
}

export default {
  name: "LineChartView",
  components: {
    LineChart,
  },
  props: {
    sensorCode: {
      type: Number,
    },
    dataPath: {
      type: String,
    },
    sensorPath: {
      type: String,
    },
  },
  async mounted() {
    // 先获取一部分数据显示在图表上
    try {
      const response = await axios.get(this.dataPath, {
        params: {
          code: this.sensorCode,
          limit: 10,
          offset: 0,
        },
      });
      const results = response.data.results;
      results.reverse();
      let lables = [];
      let datasetsData = [];
      for (let { udatetime, value } of results) {
        const datetime = parseUdatetime(udatetime);
        lables.push(datetime);
        datasetsData.push(value);
      }
      this.labels = lables;
      this.datasets[0].data = datasetsData;
    } catch (error) {
      console.log(error);
    }

    // 获取传感器信息
    try {
      const response = await axios.get(this.sensorPath, {
        params: {
          code: this.sensorCode,
        },
      });
      const sensorInfo = response.data?.results?.[0];
      if (sensorInfo) {
        this.datasets[0].label = `${sensorInfo.address} - ${sensorInfo.sensortypename}`;
      }
    } catch (error) {
      console.log(error);
    }
  },
  watch: {
    "$store.state.hx2022MsgData": function (val) {
      if (!val?.value) {
        return;
      }
      this.labels = this.labels.slice(1).concat(parseUdatetime(val.udatetime));
      this.datasets[0].data = this.datasets[0].data.slice(1).concat(val.value);
    },
  },
  data() {
    return {
      labels: [],
      datasets: [
        {
          label: "温度",
          data: [],
          borderColor: CHART_COLORS.red,
          backgroundColor: transparentize(CHART_COLORS.red, 0.5),
          pointStyle: "circle",
          pointRadius: 5,
          pointHoverRadius: 10,
        },
      ],
    };
  },
  methods: {
    handleClick() {
      this.labels = this.labels.slice(1).concat("Foo");
      this.datasets[0].data = this.datasets[0].data.slice(1).concat(20);
    },
  },
};
</script>