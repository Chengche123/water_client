<template>
  <!-- 传送门 -->
  <teleport to="body">
    <div class="modal fade" id="profileModel">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">个人信息</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form class="was-validated" ref="form">
              <div class="mb-3">
                <label class="col-form-label"
                  >手机号(仅用于告警，可为空):</label
                >
                <input
                  type="text"
                  class="form-control"
                  pattern="^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$"
                  v-model="telephoneNumber"
                />
              </div>
              <div class="mb-3">
                <label class="col-form-label">邮箱(仅用于告警，可为空):</label>
                <input type="email" class="form-control" v-model="email" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="cancelButton"
            >
              取消
            </button>
            <!-- 输入内容只有时有效时, 该按钮才使能 -->
            <button
              :disabled="!$refs?.form?.checkValidity()"
              type="button"
              class="btn btn-primary"
              @click="handleUpdate"
            >
              更新
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import axios from "axios";
import { urljoins } from "urljoins";
import { API } from "@/App";

export default {
  name: "UserUpdateProfileView",
  data() {
    return {
      telephoneNumber: null,
      email: null,
    };
  },
  mounted() {
    const user = this.$store.state.user;
    this.telephoneNumber = user.extend?.telephone_number;
    this.email = user.email;
  },
  methods: {
    async handleUpdate() {
      // 发送 patch 请求
      try {
        await axios.patch(
          urljoins(API.users, `${this.$store.state.user.id}/`),
          {
            email: this.email,
            extend: {
              telephone_number: this.telephoneNumber,
            },
          }
        );
        // 关闭该对话框
        this.$refs.cancelButton.click();
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
};
</script>