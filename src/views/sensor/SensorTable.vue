<template>
  <div>
    <table
      class="
        table table-hover table-borderless table-sm
        caption-top
        table-bordered
        border-primary
      "
    >
      <caption>
        <i class="iconfont icon ms-1 me-2">&#xe8dd;</i
        >传感器列表
      </caption>
      <thead>
        <tr>
          <!-- scope 属性在普通的 Web 浏览器中没有视觉效果，但可以通过屏幕阅读器使用。 -->
          <th class="text-center align-middle" rowspan="2">序号</th>
          <th class="text-center align-middle" rowspan="2">时间</th>
          <th class="text-center align-middle" rowspan="2">监测值</th>
          <th class="text-center align-middle" rowspan="2">地址</th>
          <th class="text-center align-middle" rowspan="2">测点类型</th>
          <th class="text-center align-middle" rowspan="2">监测状态</th>
          <th class="text-center align-middle" rowspan="2">告警阈值</th>
          <th class="text-center align-middle" colspan="3">告警方式</th>
        </tr>
        <tr>
          <th>电话</th>
          <th>短信</th>
          <th>邮箱</th>
        </tr>
      </thead>
      <!-- alarmThreshold 请求完成后再渲染表格 -->
      <tbody v-if="alarmThresholdMap">
        <transition-group
          name="items"
          enter-active-class="animate__animated animate__fadeIn"
        >
          <template
            v-for="(sensorJson, index) in sensorJsons"
            :key="sensorJson.autoid"
          >
            <SensorTableRowView
              :sensorJson="sensorJson"
              :index="index"
              :alarmThresholdMap="alarmThresholdMap"
              @changeStatusToRuning="handleChangeStatusToRuning"
            /> </template
        ></transition-group>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import SensorTableRowView from "./SensorTableRow.vue";
import { API } from "../../App";

function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

export default {
  name: "SensorTableView",
  components: { SensorTableRowView },
  mounted() {
    axios
      .get(API.sensors, {
        params: {
          limit: 10,
        },
      })
      .then((response) => {
        const results = response.data.results;
        // {autoid: 305, code: '37501207901102', sensortypename: '浊度', address: '6303采空区浊度', measurename: 'NTU'}
        this.sensorJsons = results;
      })
      .catch((error) => {
        console.log(error);
      });

    // 获取用户告警信息
    axios
      .get(API.alarmThreshold, {
        params: {
          user: this.$store.state.user.id,
          limit: 100,
        },
      })
      .then((response) => {
        const results = response.data.results;
        // 将数组转换成哈希表便于查找
        // sensor_id - json对象
        let alarmThresholdMap = Object();
        for (let item of results) {
          alarmThresholdMap[item.sensor] = item;
        }
        this.alarmThresholdMap = alarmThresholdMap;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  data() {
    return {
      sensorJsons: [],
      alarmThresholdMap: null,
    };
  },
  methods: {
    handleChangeStatusToRuning(index) {
      // setTimeout(() => {
      arraymove(this.sensorJsons, index, 0);
      // }, 1000);
    },
  },
};
</script>

<style scoped>
.items-move {
  transition: transform 3s ease;
}
</style>

<style lang="scss" scoped>
@import "@/style/utils.scss";
</style>