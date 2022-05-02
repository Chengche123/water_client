<template>
  <HomeView />
</template>

<script>
import axios from "axios";
import HomeView from "./views/home/Home";
import { urljoins } from "urljoins";

// 打印环境变量
console.log(process.env);

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.VUE_APP_SERVER_BASE_URL || "http://localhost:8000";

export const API = {
  hx2022: "/hx2022",
  sensors: "/sensors",
  login: "/users/login",
  logout: "/users/logout",
  user: "/user",
  // 末尾跟正斜线
  register: "/users/",
  alarmThreshold: "/alarm-threshold/",
  users: "/users",
};

const ws = new WebSocket(
  urljoins(
    process.env.VUE_APP_WEBSOCKET_BASE_URL || "ws://localhost:8000/",
    "/ws/hx2022-consumer/"
  )
);

export default {
  name: "App",
  components: { HomeView },
  data() {
    return {
      showNav: true,
    };
  },
  mounted() {
    console.log("app mounted");
    ws.onopen = function () {
      console.log("websocket opened");
      ws.send(
        JSON.stringify({
          action: "subscribe_to_hx2022_activity",
          request_id: new Date().getTime(),
        })
      );
    };

    ws.onmessage = (e) => {
      const msgData = JSON.parse(e.data);
      this.$store.commit("changeHx2022MsgData", msgData);
    };
  },
  unmounted() {
    ws.close();
    console.log("app unmounted");
  },
};
</script>