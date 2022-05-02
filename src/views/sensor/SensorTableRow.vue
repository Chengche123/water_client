<template>
  <tr style="cursor: pointer" @click="handleClick">
    <th scope="row">{{ index + 1 }}</th>

    <td class="text-center">
      <transition-group
        enter-active-class="animate__animated animate__headShake"
        leave-active-class="position-absolute opacity-0"
        move-class="items-move"
      >
        <span
          v-for="data in datas"
          class="d-inline-block"
          :key="data.udatetime"
        >
          {{ parseUdatetime(data.udatetime) }}</span
        >
      </transition-group>
    </td>

    <td class="text-center">
      <transition-group
        enter-active-class="animate__animated animate__headShake"
        leave-active-class="position-absolute opacity-0"
        move-class="items-move"
      >
        <span
          v-for="data in datas"
          class="d-inline-block"
          :key="data.udatetime"
        >
          {{ data.value }} {{ sensorJson.measurename }}</span
        >
      </transition-group>
    </td>

    <td>{{ sensorJson.address }}</td>
    <td>{{ sensorJson.sensortypename }}</td>
    <td v-if="STATUS == STATUS_RUNING">
      正常 <span class="spinner-grow spinner-grow-sm text-success"></span>
    </td>
    <td v-else-if="STATUS == STATUS_ABNORMAL">
      异常 <span class="spinner-grow spinner-grow-sm text-danger"></span>
    </td>
    <td v-else>
      断线 <span class="spinner-border spinner-border-sm text-secondary"></span>
    </td>
    <SensorTableRowAlarmView
      :alarmThresholdJson="alarmThresholdMap[sensorJson.autoid]"
      :sensorJson="sensorJson"
    />
  </tr>
</template>

<script>
import axios from "axios";
import SensorTableRowAlarmView from "./SensorTableRowAlarm";

export default {
  name: "SensorTableRowView",
  components: { SensorTableRowAlarmView },
  async mounted() {
    // 查询最近一次数据
    const dataPath = this.$store.state.hx2022Path;
    const response = await axios.get(dataPath, {
      params: {
        code: this.sensorJson.code,
        limit: 1,
      },
    });

    let item = response?.data?.results?.[0];
    if (!item) {
      return;
    }
    this.datas.push(item);

    // // 从父组件传来的告警信息中拿出属于该传感器的部分
    // // 类似 {id: 174, threshold_value: '1.19', method: 2, user: 1, sensor: 144}
    // this.myAlarmThreshold = this.alarmThreshold?.[this.sensorJson.autoid];
    // // 阈值
    // this.thresholdValue = this.myAlarmThreshold?.threshold_value;
  },
  props: {
    sensorJson: {
      type: Object,
    },
    index: {
      type: Number,
    },
    // 告警信息
    alarmThresholdMap: {
      type: Object,
    },
  },
  data() {
    return {
      datas: [],
      dateTime: "",
      STATUS_RUNING: 0,
      STATUS_ABNORMAL: 1,
      STATUS_DISCONNECTED: 2,
      STATUS: 2,
      // 传感器是否从断线到收到第一个消息
      isStartReceive: false,
      // 最后一次收到消息的时间
      lastReceiveTime: null,
    };
  },
  watch: {
    // 接收 ws 消息
    "$store.state.hx2022MsgData": function (val) {
      if (!val || val.code != this.sensorJson.code) {
        return;
      }

      // 消息是发给该传感器的
      this.lastReceiveTime = new Date();
      // 传感器是否从断线到收到第一个消息
      if (!this.isStartReceive) {
        this.isStartReceive = true;
        // 若持续 5 s 没收到消息，改为离线状态
        const interval = setInterval(() => {
          // 相减所得结果单位为毫秒
          const elapse = new Date() - this.lastReceiveTime;
          if (elapse > 5000) {
            // 将传感器改为离线状态
            this.STATUS = this.STATUS_DISCONNECTED;
            this.isStartReceive = false;
            clearInterval(interval);
          }
        }, 5000);
      }

      if (this.STATUS != this.STATUS_RUNING) {
        this.$emit("changeStatusToRuning", this.index);
      }

      this.STATUS = this.STATUS_RUNING;
      this.datas = [val];
    },
  },
  methods: {
    parseUdatetime(udatetime) {
      const date = new Date(udatetime);
      return date.toLocaleString();
    },
    // 表格行处理点击事件
    handleClick() {
      this.$router.push({
        name: "sensor-detail",
        params: { sensorCode: this.sensorJson.code },
      });
    },
  },
};
</script>

<style scoped>
tr:active {
  opacity: 0.75;
}
</style>