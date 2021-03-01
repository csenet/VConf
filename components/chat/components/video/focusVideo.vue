<template>
  <video :srcObject.prop="$store.state.video.focusVideo.mediaStream" autoplay />
</template>

<script>
export default {
  name: 'focusVideo.vue'
};
</script>

<style scoped>
video {
  background: gray;
  width: 100%;
  height: 100%;
}
</style>
