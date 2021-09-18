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
  z-index: -1;
  background: blue;
  right: 0;
  height: 100%;
  width: calc(100% - 305px);
}
</style>
