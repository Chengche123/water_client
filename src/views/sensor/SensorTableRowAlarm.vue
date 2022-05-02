<template>
  <td @click.stop>
    <div class="row g-0 justify-content-around">
      <div class="col-auto was-validated">
        <form ref="thresholdInput" class="input-group">
          <!-- 阈值下限 -->
          <span
            class="input-group-text iconfont icon bg-transparent px-2"
            style="font-size: 0.6rem"
            >&#xe60a;</span
          >
          <input
            class="form-control form-control-sm bg-transparent me-2"
            style="max-width: 6rem"
            type="text"
            v-model="thresholdValueMin"
            :disabled="!enableThresholdInput"
            placeholder="未设置"
            required
            pattern="(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)"
          />
          <!-- 阈值上限 -->
          <span
            class="input-group-text iconfont icon bg-transparent px-2"
            style="font-size: 0.6rem"
            >&#xe60c;</span
          >
          <input
            class="form-control form-control-sm bg-transparent"
            style="max-width: 6rem"
            type="text"
            v-model="thresholdValueMax"
            :disabled="!enableThresholdInput"
            placeholder="未设置"
            required
            pattern="(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)"
          />
        </form>
      </div>
      <div class="col-auto">
        <button
          @click="handleInputButtonClick"
          type="button"
          class="btn btn-light btn-sm"
          :class="{ 'bg-transparent': !enableThresholdInput }"
        >
          {{ inputLable }}
        </button>
      </div>
    </div>
  </td>
  <td @click.stop>
    <!-- 在没有设置告警阈值时不能设置告警方式 -->
    <div class="form-check form-switch">
      <input
        class="form-check-input bg-transparent"
        type="checkbox"
        v-model="enableTelephoneMethod"
        @change="onMethodChange"
        :disabled="!isThresholdValid"
      />
    </div>
  </td>
  <td @click.stop>
    <div class="form-check form-switch">
      <input
        class="form-check-input bg-transparent"
        type="checkbox"
        v-model="enableMessageMethod"
        @change="onMethodChange"
        :disabled="!isThresholdValid"
      />
    </div>
  </td>
  <td @click.stop>
    <div class="form-check form-switch">
      <input
        class="form-check-input bg-transparent"
        type="checkbox"
        v-model="enableEmailMethod"
        @change="onMethodChange"
        :disabled="!isThresholdValid"
      />
    </div>
  </td>
</template>

<script>
import axios from "axios";
import { API } from "@/App";
import { urljoins } from "urljoins";
import { STATUS_ENUM } from "./SensorTableRow";

export default {
  name: "SensorTableRowAlarmView",
  data() {
    return {
      thresholdValueMax: null,
      thresholdValueMin: null,
      // 验证过的数据
      validatedThresholdValueMax: null,
      validatedThresholdValueMin: null,
      // 阈值修改输入框使能
      enableThresholdInput: false,
      inputLable: "修改",
      // 告警方法 model
      enableTelephoneMethod: false,
      enableMessageMethod: false,
      enableEmailMethod: false,
      // 阈值是否有效，用于使能告警方式选择
      isThresholdValid: false,
      // 告警记录 资源 id ，用于 RESTFul
      resourceId: null,
    };
  },
  props: {
    // 如果该传感器没有告警信息，那么父组件就不会传该对象
    alarmThresholdJson: {
      type: Object,
    },
    sensorJson: {
      type: Object,
      required: true,
    },
    // 接收到的传感器实时消息
    wsMsg: {
      type: Object,
    },
  },
  emits: ["changeStatus"],
  computed: {
    // 通过 method 比特位计算最终值
    method() {
      let method = 0;
      method |= this.enableTelephoneMethod ? 0x01 : 0;
      method |= this.enableMessageMethod ? 0x02 : 0;
      method |= this.enableEmailMethod ? 0x04 : 0;
      return method;
    },
  },
  mounted() {
    // 有些传感器并没有设置告警信息
    if (!this.alarmThresholdJson) {
      return;
    }
    this.resourceId = this.alarmThresholdJson.id;
    // 具有告警信息，直接使能告警方式选择框
    this.isThresholdValid = true;
    // 取出阈值范围
    this.thresholdValueMin = this.alarmThresholdJson.threshold_value_min;
    this.thresholdValueMax = this.alarmThresholdJson.threshold_value_max;
    // 从接口返回的数据，一定是已经经过验证的
    this.validatedThresholdValueMax = this.thresholdValueMax;
    this.validatedThresholdValueMin = this.thresholdValueMin;
    // 从 method 中根据比特位取出信息
    const method = this.alarmThresholdJson.method;
    this.enableTelephoneMethod = (method & 0x01) == 0x01;
    this.enableMessageMethod = (method & 0x02) == 0x02;
    this.enableEmailMethod = (method & 0x04) == 0x04;
  },
  methods: {
    handleInputButtonClick() {
      // 如果还没有输入数据，就不需要验证
      if (!this.enableThresholdInput) {
        this.enableThresholdInput = true;
        return;
      }
      // 验证数据，卫戍
      if (!this.$refs.thresholdInput.checkValidity()) {
        return;
      }
      // 保存验证过的数据
      this.validatedThresholdValueMin = this.thresholdValueMin;
      this.validatedThresholdValueMax = this.thresholdValueMax;
      // 创建一条新记录
      if (!this.isThresholdValid) {
        axios
          .post(API.alarmThreshold, {
            threshold_value_max: this.thresholdValueMax,
            threshold_value_min: this.thresholdValueMin,
            user: this.$store.state.user.id,
            sensor: this.sensorJson.autoid,
          })
          .then((response) => {
            // 记录创建成功
            this.isThresholdValid = true;
            // 除能阈值输入框
            this.enableThresholdInput = false;
            // 保存记录 id
            this.resourceId = response.data.id;
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      }
      // 已有记录，更新数据
      else {
        const URI = urljoins(API.alarmThreshold, `${this.resourceId}/`);
        axios
          .patch(URI, {
            threshold_value_max: this.thresholdValueMax,
            threshold_value_min: this.thresholdValueMin,
          })
          .then(() => {
            // 除能阈值输入框
            this.enableThresholdInput = false;
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      }
    },
    onMethodChange() {
      // 不需要做验证，直接发送 PATCH 请求就行
      // 因为只有在已经创建了告警阈值的情况下才能更改告警方式
      const URI = urljoins(API.alarmThreshold, `${this.resourceId}/`);
      axios
        .patch(URI, {
          method: this.method,
        })
        .then(() => {})
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  },
  watch: {
    // 聚焦阈值输入框
    enableThresholdInput: async function (val) {
      if (val == true) {
        // 使能之后 lable 变为 '确认'
        this.inputLable = "确认";
        // 等待 DOM 被渲染完成，即输入框被使能
        await this.$nextTick();
        this.$refs.thresholdInput.focus();
      } else {
        // 除能之后 lable 变为 '修改'
        this.inputLable = "修改";
      }
    },
    // 传感器消息，用于判断是否超过阈值
    wsMsg: function (val) {
      const value = val.value;
      // 卫戍，还没有设置阈值
      if (
        !this.validatedThresholdValueMin ||
        !this.validatedThresholdValueMax
      ) {
        return;
      }
      const thresholdValueMin = parseFloat(this.validatedThresholdValueMin);
      const thresholdValueMax = parseFloat(this.validatedThresholdValueMax);
      if (value <= thresholdValueMin || value >= thresholdValueMax) {
        this.$emit("changeStatus", STATUS_ENUM.STATUS_ABNORMAL);
      } else {
        this.$emit("changeStatus", STATUS_ENUM.STATUS_RUNING);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/utils.scss";
</style>