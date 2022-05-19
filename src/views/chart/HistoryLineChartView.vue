<template>
  <!-- 使用改变 key 的方便重建组件 -->
  <LineChart
    :datasets="datasets"
    :labels="labels"
    :chartOptions="chartOptions"
    :width="800"
    :height="200"
    :key="lineChartKey"
    ref="historyChart"
  />
  <div class="row my-3 justify-content-center">
    <div class="col-auto">从</div>
    <div class="col-auto">
      <input
        class="bg-transparent me-3 animate__animated"
        :class="{ animate__headShake: animateDatetimeAfter }"
        v-model="datetime_after"
        type="datetime-local"
      />
    </div>
    <div class="col-auto">到</div>
    <div class="col-auto">
      <input
        class="bg-transparent ms-3 animate__animated"
        :class="{ animate__headShake: animateDatetimeBefore }"
        v-model="datetime_before"
        type="datetime-local"
      />
    </div>
    <div class="col-auto">
      <button
        @click="validateDatetimeField"
        class="btn btn-primary btn-sm bg-transparent text-dark"
      >
        查询
      </button>
      <button
        @click="handleExportExcel"
        class="btn btn-primary btn-sm bg-transparent text-dark ms-2"
      >
        导出 Excel
      </button>
      <button
        @click="handleExportImage"
        class="btn btn-primary btn-sm bg-transparent text-dark ms-2"
      >
        导出图像
      </button>
    </div>
  </div>
</template>

<script>
import LineChart from "../../components/LineChart";
import { CHART_COLORS, parseUdatetime } from "../../utils/utils";
import axios from "axios";
import { utils, writeFile } from "xlsx";

let animateInterval = 3;

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
        // 显示标题
        plugins: {
          title: {
            display: true,
            text: "",
          },
        },
        interaction: {
          // if true, the interaction mode only applies when the mouse position intersects an item on the chart.
          intersect: false,
        },
        animations: {
          x: {
            type: "number",
            easing: "linear",
            duration: animateInterval,
            from: NaN, // the point is initially skipped
            delay(ctx) {
              if (ctx.type !== "data" || ctx.xStarted) {
                return 0;
              }
              ctx.xStarted = true;
              return ctx.index * animateInterval;
            },
          },
          y: {
            type: "number",
            easing: "linear",
            duration: animateInterval,
            from: previousY,
            delay(ctx) {
              if (ctx.type !== "data" || ctx.yStarted) {
                return 0;
              }
              ctx.yStarted = true;
              return ctx.index * animateInterval;
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
            ticks: {
              // x 轴显示 10 个标签
              maxTicksLimit: 10,
            },
            // 不显示网格
            grid: {
              display: false,
            },
          },
        },
      },
      datetime_after: null,
      datetime_before: null,
      animateDatetimeAfter: false,
      animateDatetimeBefore: false,
      lineChartKey: 1,
      results: [],
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
          // 返回的数据按照时间倒序，取最新的 1000 条
          ordering: "-udatetime",
        },
      });
      const results = response.data.results;
      if (!results) {
        return;
      }
      // 调整顺序，按照时间顺序
      results.reverse();
      this.processResults(results);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async validateDatetimeField() {
      // 对所选时间段进行验证
      if (!this.datetime_after) {
        this.animateDatetimeAfter = false;
        setTimeout(() => {
          this.animateDatetimeAfter = true;
        }, 100);
        return;
      }
      if (!this.datetime_before) {
        this.animateDatetimeBefore = false;
        setTimeout(() => {
          this.animateDatetimeBefore = true;
        }, 100);
        return;
      }
      try {
        const response = await axios.get(this.dataPath, {
          params: {
            code: this.sensorCode,
            // 限制条数
            limit: 1000,
            offset: 0,
            udatetime_after: this.datetime_after
              ? new Date(this.datetime_after).toISOString()
              : null,
            udatetime_before: this.datetime_before
              ? new Date(this.datetime_before).toISOString()
              : null,
            // 返回的数据按照时间顺序
            ordering: "udatetime",
          },
        });
        const results = response.data.results;
        this.processResults(results);
      } catch (error) {
        console.log(error);
      }
    },
    processResults(results) {
      // 在图表的上方显示时间段
      let text = ``;
      if (results.length >= 2) {
        const begin_datetime = parseUdatetime(results[0].udatetime);
        const end_datetime = parseUdatetime(
          results[results.length - 1].udatetime
        );
        text = `${begin_datetime} ~ ${end_datetime}`;
      }
      this.chartOptions.plugins.title.text = text;
      // 每次数据改变时重建组件
      this.lineChartKey += 1;
      const labels = [];
      const data = [];
      // 保存 json 数据，用于导出
      this.results = results;
      for (let item of results) {
        labels.push(parseUdatetime(item.udatetime));
        data.push(item.value);
      }
      this.labels = labels;
      this.datasets[0].data = data;
    },
    handleExportExcel() {
      // 确定有数据可以导出
      if (!this.results) {
        return;
      }
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(this.results);
      utils.book_append_sheet(wb, ws);
      const chartTitle = this.chartOptions.plugins.title.text;
      writeFile(wb, `${chartTitle}.xlsx`);
    },
    handleExportImage() {
      // 确定有数据可以导出
      if (!this.results) {
        return;
      }
      const chartInstance = this.$refs.historyChart.$refs.lineChart.chart;
      let a = document.createElement("a");
      a.href = chartInstance.toBase64Image();
      const chartTitle = this.chartOptions.plugins.title.text;
      a.download = `${chartTitle}.png`;
      a.click();
    },
  },
};
</script>