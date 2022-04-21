<template>
  <HomeView />
</template>

<script>
import axios from "axios";
import HomeView from "./views/home/Home";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000";

export const API = {
  hx2022: "/hx2022",
  sensors: "/sensors",
  login: "/users/login",
  logout: "/users/logout",
  user: "/user",
};

const ws = new WebSocket("ws://localhost:8000/ws/hx2022-consumer/");

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