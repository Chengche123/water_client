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
    <td v-if="STATUS == STATUS_ENUM.STATUS_RUNING">
      正常 <span class="spinner-grow spinner-grow-sm text-success"></span>
    </td>
    <td v-else-if="STATUS == STATUS_ENUM.STATUS_ABNORMAL">
      异常 <span class="spinner-grow spinner-grow-sm text-danger"></span>
    </td>
    <td v-else>
      断线 <span class="spinner-border spinner-border-sm text-secondary"></span>
    </td>
    <SensorTableRowAlarmView
      :alarmThresholdJson="alarmThresholdMap[sensorJson.autoid]"
      :sensorJson="sensorJson"
      :wsMsg="wsMsg"
      @changeStatus="handleChangeStatus"
    />
  </tr>
</template>

<script>
import axios from "axios";
import SensorTableRowAlarmView from "./SensorTableRowAlarm";

export const STATUS_ENUM = {
  STATUS_RUNING: 0,
  STATUS_ABNORMAL: 1,
  STATUS_DISCONNECTED: 2,
};

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
      STATUS_ENUM,
      STATUS: STATUS_ENUM.STATUS_DISCONNECTED,
      // 传感器是否从断线到收到第一个消息
      isStartReceive: false,
      // 最后一次收到消息的时间
      lastReceiveTime: null,
      // ws message
      wsMsg: null,
    };
  },
  watch: {
    // 接收 ws 消息
    "$store.state.hx2022MsgData": function (val) {
      if (!val || val.code != this.sensorJson.code) {
        return;
      }

      // 保存收到的消息，传递给子组件
      this.wsMsg = val;

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
            this.STATUS = this.STATUS_ENUM.STATUS_DISCONNECTED;
            this.isStartReceive = false;
            clearInterval(interval);
          }
        }, 5000);
      }

      // 如果从断线到收到消息
      if (this.STATUS == this.STATUS_ENUM.STATUS_DISCONNECTED) {
        // 让父组件将该行移到前排
        this.$emit("changeStatusToRuning", this.index);
      }

      // !!!
      // 这里不再改变该组件的状态，让告警子组件去做
      // 因为不知道数据是正常还是异常

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
    // 处理来自告警子组件的事件
    handleChangeStatus(status) {
      // 告警子组件能改变的状态只能有 '正常' 和 '异常'
      if (
        status != STATUS_ENUM.STATUS_RUNING &&
        status != STATUS_ENUM.STATUS_ABNORMAL
      ) {
        console.log(`error! status:${status}`);
        return;
      }
      this.STATUS = status;
    },
  },
};
</script>

<style scoped>
tr:active {
  opacity: 0.75;
}
</style>