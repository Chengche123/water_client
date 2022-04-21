<template>
  <LineChart
    :datasets="datasets"
    :labels="labels"
    :chartOptions="chartOptions"
    :width="192"
    :height="108"
  />
</template>

<script>
import LineChart from "../../components/LineChart";
import { CHART_COLORS, parseUdatetime } from "../../utils/utils";
import axios from "axios";

const duration = 10;

const previousY = (ctx) =>
  ctx.index === 0
    ? ctx.chart.scales.y.getPixelForValue(100)
    : ctx.chart
        .getDatasetMeta(ctx.datasetIndex)
        .data[ctx.index - 1].getProps(["y"], true).y;

export default {
  name: "HistoryLineChartView",
  props: {
    sensorCode: {
      type: String,
      required: true,
    },
    dataPath: {
      type: String,
    },
  },
  components: { LineChart },
  data() {
    return {
      labels: [],
      datasets: [
        {
          label: "历史数据",
          borderColor: CHART_COLORS.red,
          borderWidth: 1,
          radius: 0,
          data: [],
        },
      ],
      chartOptions: {
        interaction: {
          // if true, the interaction mode only applies when the mouse position intersects an item on the chart.
          intersect: false,
        },
        animations: {
          x: {
            type: "number",
            easing: "linear",
            duration: duration,
            from: NaN, // the point is initially skipped
            delay(ctx) {
              if (ctx.type !== "data" || ctx.xStarted) {
                return 0;
              }
              ctx.xStarted = true;
              return ctx.index * duration;
            },
          },
          y: {
            type: "number",
            easing: "linear",
            duration: duration,
            from: previousY,
            delay(ctx) {
              if (ctx.type !== "data" || ctx.yStarted) {
                return 0;
              }
              ctx.yStarted = true;
              return ctx.index * duration;
            },
          },
        },
        scales: {
          y: {
            ticks: {
              precision: 2,
            },
            // 不显示网格
            grid: {
              display: false,
            },
          },
          x: {
            // 不显示网格
            grid: {
              display: false,
            },
          },
        },
      },
    };
  },
  async mounted() {
    try {
      // 拉取最近 1000 条历史数据
      const response = await axios.get(this.dataPath, {
        params: {
          code: this.sensorCode,
          limit: 1000,
          offset: 0,
        },
      });
      const results = response.data.results;
      if (!results) {
        return;
      }
      const labels = [];
      const data = [];
      // 前面的数据是最新的，所以倒序
      results.reverse();
      for (let item of results) {
        labels.push(parseUdatetime(item.udatetime));
        data.push(item.value);
      }
      this.labels = labels;
      this.datasets[0].data = data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>