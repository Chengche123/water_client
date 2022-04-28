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
        传感器列表
      </caption>
      <thead>
        <tr>
          <th scope="col">序号</th>
          <th class="text-center" scope="col">时间</th>
          <th class="text-center" scope="col">监测值</th>
          <th scope="col">地址</th>
          <th scope="col">测点类型</th>
          <th scope="col">监测状态</th>
          <th scope="col">告警阈值</th>
          <th colspan="3" class="text-center" scope="col">告警方式</th>
        </tr>
      </thead>
      <!-- alarmThreshold 请求完成后再渲染表格 -->
      <tbody v-if="alarmThreshold">
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
              :alarmThreshold="alarmThreshold"
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
          limit: 30,
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
        let alarmThreshold = Object();
        for (let item of results) {
          alarmThreshold[item.sensor] = item;
        }
        this.alarmThreshold = alarmThreshold;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  data() {
    return {
      sensorJsons: [],
      alarmThreshold: null,
    };
  },
  methods: {
    handleChangeStatusToRuning(index) {
      setTimeout(() => {
        arraymove(this.sensorJsons, index, 0);
      }, 1000);
    },
  },
};
</script>

<style scoped>
.items-move {
  transition: transform 3s ease;
}
</style>