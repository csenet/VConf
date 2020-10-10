<template>
  <div>
    <video
      autoplay
      :srcObject.prop="stream"
      :peerId="peerId"
      width="240"
      height="180"
      @click="focus"
    />
  </div>
</template>

<script>
export default {
  name: 'Video',
  props: ['stream', 'peerId'],
  methods: {
    focus () {
      this.$emit('focused', this.peerId, this.stream);
    }
  }
};
</script>

<style scoped>
video {
  border: solid 2px black;
  background: rgb(241, 0, 0);
}
</style>
