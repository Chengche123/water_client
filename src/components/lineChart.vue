<template>
  <Line
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />

  <button @click="handleAddClick">增加</button>
</template>

<script>
import { Line } from "vue-chartjs";
import "chart.js/auto";
import colorLib from "@kurkle/color";

function transparentize(value, opacity) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}

const CHART_COLORS = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

export default {
  name: "LineChartView",
  components: {
    Line,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chartData: {
        labels: [
          "January",
          "February",
          "March",
          "January",
          "February",
          "March",
          "January",
          "February",
          "March",
          "January",
          "February",
          "March",
        ],
        datasets: [
          {
            label: "Dataset 1",
            data: [40, 20, 12, 40, 20, 12, 40, 20, 12, 40, 20, 12],
            borderColor: CHART_COLORS.red,
            backgroundColor: transparentize(CHART_COLORS.red, 0.5),
          },
          // {
          //   label: "Dataset 2",
          //   data: [20, 12, 40, 20, 12, 40],
          //   borderColor: "blue",
          //   backgroundColor: "black",
          // },
        ],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },
  methods: {
    handleAddClick() {
      this.chartData.datasets[0].data =
        this.chartData.datasets[0].data.concat(34);
      this.chartData.labels = this.chartData.labels.concat("Foo");
    },
  },
};
</script>