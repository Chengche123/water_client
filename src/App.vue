<template>
  <router-view />
</template>

<script>
import axios from "axios";

// axios.defaults.baseURL =
//   "https://www.fastmock.site/mock/820cb4d076cec84c7d445bb352e6c519/test";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000";

const ws = new WebSocket("ws://localhost:8000/ws/hx2022-consumer/");

export default {
  name: "App",
  mounted() {
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
  unmounted() {},
};
</script>