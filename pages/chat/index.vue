<template>
  <div>
    <div class="container-fluid background">
      <setting
        v-if="viewFlag"
        ref="Setting"
        :local-stream="localStream"
        :user-stream="userStream"
        :url="url"
        @close="closeWindows"
        @changeModel="changeModel"
        @changeBackground="changeBackground"
        @startCamera="startCamera"
        @startMirror="startMirror"
      />
      <div class="row">
        <div class="col-3">
          <div class="container">
            <div class="row">
              <tracker
                ref="Tracker"
                class="mt-3 mb-3"
                @axis="axis"
                @getAudioTrack="getAudioTrack"
                @getStream="getUserVideoStream"
              />
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
              <div class="jumbotron mt-3 mb-1 pt-3 pb-3 bg-light ">
                <button class="btn btn-info" @click="toggleConnect">
                  {{ isConnected ? '退室' : '入室' }}
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
              </div>
              <div class="jumbotron pt-3 pb-3 bg-light">
                <button class="btn btn-success mr-1" @click="changeTracking">
                  <font-awesome-icon v-if="isTracking" icon="stop" />
                  <font-awesome-icon v-if="!isTracking" icon="play" />
                </button>
                <button class="btn btn-danger" @click="initializePosition">
                  <font-awesome-icon icon="undo-alt" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <RemoteVideo />
      </div>
    </div>
    <FocusVideo />
    <WebRTC ref="WebRTC" :local-stream="localStream" :audio-track="audioTrack" />
  </div>
</template>
<script>
import Tracker from '~/components/chat/components/tracker/tracker.vue';
import Vrm from '~/components/chat/components/vrm.vue';
import RemoteVideo from '~/components/chat/components/video/remoteVideo.vue';
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
    WebRTC,
    RemoteVideo
  },
  data () {
    return {
      localStream: '',
      audioTrack: '',
      userStream: '',
      viewFlag: true,
      isTracking: false,
      isConnected: false,
      isMuted: false,
      roomId: '',
      url: ''
    };
  },
  mounted () {
    if (this.$nuxt.$route.query.room) {
      this.roomId = this.$nuxt.$route.query.room;
      this.url = 'https://vconf.vercel.app/chat?room=' + this.roomId;
    }
  },
  methods: {
    startMirror () {
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
    },
    getUserVideoStream (stream) {
      this.userStream = stream;
    }
  }
};

</script>
<style scoped>
.background {
  position: fixed;
  z-index: -1;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
}
</style>
