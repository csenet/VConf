<template>
  <div class="row">
    <div class="jumbotron mt-3 pt-3 pb-3 bg-light">
      <button class="btn btn-success mr-1" @click="changeTracking">
        <font-awesome-icon v-if="isTracking" icon="stop" />
        <font-awesome-icon v-if="!isTracking" icon="play" />
      </button>
      <button class="btn btn-info" @click="toggleConnect">
        {{ isConnected ? '切断' : '接続' }}
      </button>
      <button class="btn btn-dark" @click="openSetting">
        <font-awesome-icon icon="cogs" />
      </button>
      <button class="btn btn-info" @click="toggleMute">
        <font-awesome-icon v-if="isMuted" icon="volume-up" />
        <font-awesome-icon v-if="!isMuted" icon="volume-mute" />
      </button>
      <button class="btn btn-info" @click="mirror">
        <font-awesome-icon icon="desktop" />
      </button>
      <button class="btn btn-info" @click="startCamera">
        <font-awesome-icon icon="video" />
      </button>
      <button class="btn btn-danger" @click="initializePosition">
        <font-awesome-icon icon="undo-alt" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toolBar'
};
</script>

<style scoped>

</style>
