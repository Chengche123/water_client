<template>
  <LineChart
    :labels="labels"
    :datasets="datasets"
    :chartOptions="chartOptions"
    :width="192"
    :height="108"
  />
  <div class="text-center"></div>
</template>

<script>
import LineChart from "../../components/LineChart";
import {
  CHART_COLORS,
  transparentize,
  parseUdatetime,
} from "../../utils/utils";
import axios from "axios";

export default {
  name: "RTLineChartView",
  components: {
    LineChart,
  },
  props: {
    sensorCode: {
      type: String,
    },
    dataPath: {
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
      const response = await axios.get(this.$store.state.sensorPath, {
        params: {
          code: this.sensorCode,
        },
      });

      const sensorInfo = response.data?.results?.[0];
      if (!sensorInfo) {
        return;
      }
      this.datasets[0].label = `${sensorInfo.address} - ${sensorInfo.sensortypename}`;
      this.chartOptions.scales.y.title.text = `${sensorInfo.sensortypename}/${sensorInfo.measurename}`;
    } catch (error) {
      console.log(error);
    }
  },
  watch: {
    "$store.state.hx2022MsgData": function (val) {
      if (!val) {
        return;
      }

      // 只接受发给该页面的数据
      if (val.code != this.sensorCode) {
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
          label: "",
          data: [],
          borderColor: CHART_COLORS.red,
          backgroundColor: transparentize(CHART_COLORS.red, 0.5),
          pointStyle: "circle",
          pointRadius: 5,
          pointHoverRadius: 10,
          fill: "start",
        },
      ],
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              precision: 2,
            },
            title: {
              color: "black",
              display: true,
              text: "",
            },
            // 不显示网格
            grid: {
              display: false,
            },
          },
          x: {
            title: {
              color: "black",
              display: true,
              text: "时间",
            },
            // 不显示网格
            grid: {
              display: false,
            },
          },
        },
      },
    };
  },
  methods: {},
};
</script>