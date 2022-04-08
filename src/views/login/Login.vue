<template>
  <div
    class="
      container
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
    <div class="col-md-10 mx-auto col-lg-5">
      <form class="p-4 p-md-5 border rounded-3 bg-light">
        <div class="form-floating mb-3">
          <input
            v-model="username"
            type="text"
            class="form-control"
            id="floatingInput"
            autocomplete="off"
          />
          <label for="floatingInput">账号</label>
        </div>
        <div class="form-floating mb-3">
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="floatingPassword"
            autocomplete="off"
          />
          <label for="floatingPassword">密码</label>
        </div>
        <button @click="handleLogin" class="w-100 btn btn-lg btn-primary">
          登录
        </button>
        <button
          @click="handleRegister"
          class="w-100 btn btn-lg btn-secondary mt-3"
        >
          注册
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ToastView from "../../components/Toast.vue";

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
  methods: {
    async handleLogin() {
      try {
        await axios.post("/users/login", {
          username: "Fred",
          password: "Flintstone",
        });
        localStorage.isLogin = true;
        this.$router.push({ name: "home" });
      } catch (error) {
        this.toastParams.body = "登录失败";
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      }
    },
    handleRegister() {
      this.$router.push({ name: "register" });
    },
  },
};
</script>
