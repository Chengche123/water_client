<template>
  <div class="alert alert-danger" role="alert">
    {{ body }}
  </div>
</template>

<script>
export default {
  props: ["body"],
  name: "ToastView",
};
</script>
