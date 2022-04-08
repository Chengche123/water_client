<template>
  <router-view />
</template>

<script>
import axios from "axios";

// axios.defaults.baseURL =
//   "https://www.fastmock.site/mock/820cb4d076cec84c7d445bb352e6c519/test";

axios.defaults.baseURL = "http://127.0.0.1:8000";

export default {
  name: "App",
};
</script>