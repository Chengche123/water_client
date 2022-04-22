<template>
  <div
    class="
      container-fluid
      position-absolute
      top-50
      start-50
      translate-middle
      opacity-75
    "
  >
    <ToastView
      class="position-absolute top-50 start-50 translate-middle"
      v-if="showToast"
      :="toastParams"
      style="z-index: 1"
    />
    <div class="mx-auto col-4">
      <form
        class="p-4 border rounded-3 bg-light was-validated"
        @submit.prevent
        ref="myForm"
        novalidate
      >
        <div class="form-floating mb-3">
          <input
            v-model="username"
            type="text"
            class="form-control"
            id="floatingUsername"
            autocomplete="off"
            required
          />
          <label class="text-info" for="floatingUsername">账号</label>
          <div class="invalid-feedback">账号不能为空</div>
        </div>
        <div class="form-floating mb-3">
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="floatingPassword"
            autocomplete="off"
            required
          />
          <label class="text-info" for="floatingPassword">密码</label>
          <div class="invalid-feedback">密码不能为空</div>
        </div>
        <button @click="handleLogin" class="w-100 btn btn-lg btn-primary">
          登录
        </button>
        <button
          @click="$router.push({ name: 'register' })"
          class="mt-2 w-100 btn btn-lg btn-secondary"
        >
          没有账号，去注册
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ToastView from "../../components/Toast.vue";
import { API } from "../../App";

export default {
  name: "LoginView",
  components: { ToastView },
  data() {
    return {
      username: "",
      password: "",
      showToast: false,
      toastParams: {
        body: "",
      },
    };
  },
  mounted() {
    // 获取账号和密码字段。填在输入框中
    if (this.$route.params.username) {
      this.username = this.$route.params.username;
    }

    if (this.$route.params.password) {
      this.password = this.$route.params.password;
    }
  },
  methods: {
    async handleLogin() {
      if (!this.$refs.myForm.checkValidity()) {
        return;
      }

      try {
        const response = await axios.get(API.login, {
          auth: {
            username: this.username,
            password: this.password,
          },
        });
        this.$store.commit("changeUser", response?.data);
        this.$router.push({ name: "home" });
      } catch (error) {
        this.toastParams.body = error.response.data.detail;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      }
    },
  },
};
</script>
