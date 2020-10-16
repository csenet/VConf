<template>
  <video
    autoplay
    :srcObject.prop="stream"
    :peerId="peerId"
    width="240"
    height="180"
    @click="focus"
  />
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
  margin: 5px 5px;
}
</style>
