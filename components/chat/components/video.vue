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
      this.data = { stream: this.stream, peerId: this.peerId };
      this.$emit('focused', this.data);
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
