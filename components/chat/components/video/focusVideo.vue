<template>
  <video :srcObject.prop="$store.state.video.focusVideo.mediaStream" autoplay/>
</template>

<script>
export default {
  name: 'focusVideo.vue'
};
</script>

<style scoped>
video {
  position: absolute;
  background: cornflowerblue;
  z-index: -2;
  height: 100vh;
  width: 100vw;
}
</style>
