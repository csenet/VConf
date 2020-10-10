<template>
  <div class="container-fluid background">
    <setting
      v-if="viewFlag"
      ref="Setting"
      :local-stream="localStream"
      @close="closeWindows"
      @changeModel="changeModel"
      @changeBackground="changeBackground"
    />
    <div class="row">
      <div class="col-3">
        <div class="container">
          <div class="row">
            <tracker ref="Tracker" class="mt-3 mb-3" @axis="axis" @getAudioTrack="getAudioTrack" />
          </div>
          <div class="row">
            <vrm
              ref="Vrm"
              @getStream="getStream"
              @getTrack="getTrack"
              @finishLoading="finishLoading"
            />
          </div>
          <div class="row">
            <div class="jumbotron mt-3 pt-3 pb-3 bg-light">
              <button class="btn btn-success mr-1" @click="changeTracking">
                <font-awesome-icon v-if="isTracking" icon="stop" />
                <font-awesome-icon v-if="!isTracking" icon="video" />
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
                <font-awesome-icon icon="desktop" />
              </button>
              <button class="btn btn-danger" @click="initializePosition">
                <font-awesome-icon icon="undo-alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <FocusVideo />
      </div>
      <div id="sticky-sidebar" class="col">
        <div class="sticky-top">
          <WebRTC ref="WebRTC" :local-stream="localStream" :audio-track="audioTrack" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.background {
  position: relative;
  height: 100vh;
  min-height: 300px;
  background-image: url("~assets/img/syber.jpeg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  z-index: 0;
  overflow: hidden;
}

.background::before {
  content: "";
  background: inherit;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
}
</style>
<script>
import Tracker from '~/components/chat/components/tracker/tracker.vue';
import Vrm from '~/components/chat/components/vrm.vue';
import WebRTC from '~/components/chat/components/webrtc.vue';
import Setting from '~/components/chat/components/setting.vue';
import FocusVideo from '~/components/chat/components/video/focusVideo.vue';

export default {
  name: 'Index',
  components: {
    Tracker,
    Vrm,
    Setting,
    FocusVideo,
    WebRTC
  },
  data () {
    return {
      localStream: '',
      audioTrack: '',
      viewFlag: true,
      isTracking: false,
      isConnected: false,
      isMuted: false
    };
  },
  mounted () {
  },
  methods: {
    mirror () {
      this.$refs.WebRTC.startMirror();
    },
    toggleMute () {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.$refs.WebRTC.mute();
      } else {
        this.$refs.WebRTC.unmute();
      }
    },
    connect () {
      this.$refs.WebRTC.connect();
    },
    close () {
      this.$refs.WebRTC.close();
    },
    toggleConnect () {
      this.isConnected = !this.isConnected;
      if (this.isConnected) {
        this.$refs.WebRTC.connect();
      } else {
        this.$refs.WebRTC.close();
      }
    },
    openSetting () {
      this.viewFlag = true;
    },
    closeWindows () {
      this.viewFlag = false;
    },
    getStream (stream) {
      this.localStream = stream;
    },
    getAudioTrack (track) {
      this.audioTrack = track;
    },
    changeModel (modelName) {
      this.$refs.Vrm.LoadModels(modelName);
    },
    changeBackground (color) {
      this.$refs.Vrm.changeBackground(color);
    },
    changeTracking () {
      this.isTracking = !this.isTracking;
      if (this.isTracking) {
        this.$refs.Tracker.startTracking();
      } else {
        this.$refs.Tracker.stopTracking();
      }
    },
    getTrack () {
      this.$refs.Tracker.drawLoop();
    },
    axis (axis) {
      this.$refs.Vrm.ChangeVrm(axis);
    },
    startCamera () {
      this.$refs.Tracker.startCamera();
    },
    finishLoading () {
      this.$refs.Setting.changeStatus();
    },
    initializePosition () {
      this.$refs.Tracker.initializeTilt();
    }
  }
};

</script>
