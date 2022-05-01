<template>
  <td @click.stop>
    <div class="row">
      <div class="col-auto was-validated">
        <input
          class="form-control form-control-sm bg-transparent"
          style="max-width: 8rem"
          type="text"
          v-model="thresholdValue"
          :disabled="!enableThresholdInput"
          ref="thresholdInput"
          placeholder="未设置"
          required
          pattern="(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)"
        />
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
        :disabled="!thresholdValue"
      />
      <label class="form-check-label">电话</label>
    </div>
  </td>
  <td @click.stop>
    <div class="form-check form-switch">
      <input
        class="form-check-input bg-transparent"
        type="checkbox"
        v-model="enableMessageMethod"
        @change="onMethodChange"
        :disabled="!thresholdValue"
      />
      <label class="form-check-label">短信</label>
    </div>
  </td>
  <td @click.stop>
    <div class="form-check form-switch">
      <input
        class="form-check-input bg-transparent"
        type="checkbox"
        v-model="enableEmailMethod"
        @change="onMethodChange"
        :disabled="!thresholdValue"
      />
      <label class="form-check-label">邮箱</label>
    </div>
  </td>
</template>

<script>
export default {
  name: "SensorTableRowAlarmView",
  data() {
    return {
      thresholdValue: null,
      // 阈值修改输入框使能
      enableThresholdInput: false,
      inputLable: "修改",
      // 告警方法 model
      enableTelephoneMethod: false,
      enableMessageMethod: false,
      enableEmailMethod: false,
    };
  },
  props: {
    alarmThresholdJson: {
      type: Object,
    },
  },
  computed: {
    // 通过 method 比特位计算最终值
    method() {
      let res = 0;
      res |= this.enableTelephoneMethod ? 0x01 : 0;
      res |= this.enableMessageMethod ? 0x02 : 0;
      res |= this.enableEmailMethod ? 0x04 : 0;
      return res;
    },
  },
  mounted() {
    // 有些传感器并没有设置告警信息
    if (!this.alarmThresholdJson) {
      return;
    }
    this.thresholdValue = this.alarmThresholdJson.threshold_value;
    // 从 method 中根据比特位取出信息
    const method = this.alarmThresholdJson.method;
    this.enableTelephoneMethod = (method & 0x01) == 0x01;
    this.enableMessageMethod = (method & 0x02) == 0x02;
    this.enableEmailMethod = (method & 0x04) == 0x04;
  },
  methods: {
    handleInputButtonClick() {
      // 数据是否已经经过验证
      if (this.$refs.thresholdInput.checkValidity()) {
        this.enableThresholdInput = !this.enableThresholdInput;
      }
    },
    onMethodChange() {
      console.log(this.method);
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
  },
};
</script>