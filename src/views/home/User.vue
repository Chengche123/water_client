<template>
  <li class="nav-item">
    <div class="text-primary">
      {{ userJson?.username }} {{ userJson?.is_superuser ? "(管理员)" : "" }}
      <a
        class="text-secondary text-decoration-underline"
        role="button"
        @click="handleLogout"
        >登出</a
      >
    </div>
  </li>
</template>

<script>
import axios from "axios";
import { API } from "../../App";

export default {
  name: "UserView",
  computed: {
    userJson() {
      return this.$store.state.user;
    },
  },
  methods: {
    async handleLogout() {
      // 先调用接口，然后直接跳转到登录页面
      try {
        await axios.get(API.logout);
        this.$router.push({ name: "login" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>