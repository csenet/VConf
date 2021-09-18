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
      <div class="sidebar">
        <div class="row">
          <div class="col-3">
            <div class="container">
              <div class="row" style="width: 265px !important;">
                <tracker
                  ref="Tracker"
                  class="mt-3 mb-3"
                  @axis="axis"
                  @getAudioTrack="getAudioTrack"
                  @getStream="getUserVideoStream"
                />
              </div>
              <div class="row" style="width: 265px !important;">
                <vrm
                  ref="Vrm"
                  @getStream="getStream"
                  @getTrack="getTrack"
                  @finishLoading="finishLoading"
                />
              </div>
              <div class="row" style="width: 265px !important;">
                <div class="jumbotron mt-3 mb-1 pt-3 pb-3 bg-light">
                  マウスでモデルの視点変更
                  <hr>
                  <button class="btn btn-outline-primary" @click="toggleConnect">
                    {{ isConnected ? 'ルーム退室' : 'ルーム入室' }}
                  </button>
                  <button class="btn btn-outline-primary" @click="toggleMute">
                    <font-awesome-icon v-if="isMuted" icon="volume-up"/>
                    <font-awesome-icon v-if="!isMuted" icon="volume-mute"/>
                  </button>
                  <button class="btn btn-dark" @click="openSetting">
                    <font-awesome-icon icon="cogs"/>
                    設定
                  </button>
                  <hr>
                  <p>トラッキング</p>
                  <button class="btn btn-success mr-1" @click="changeTracking">
                    <span v-if="isTracking"><font-awesome-icon icon="stop"/> 停止</span>
                    <span v-if="!isTracking"><font-awesome-icon icon="play"/> 開始</span>
                  </button>
                  <button class="btn btn-danger" @click="initializePosition">
                    <font-awesome-icon icon="undo-alt"/>
                    初期位置セット
                  </button>
                  <hr>
                  <p>モーション</p>
                  <div class="form-group">
                    <button
                      class="btn btn-outline-light"
                      @click="$store.commit('vrm/setMotionNum',1)"
                    >
                      <img src="../../assets/img/icons/no.png" height="30" width="30"/>
                    </button>
                    <button
                      class="btn btn-outline-light"
                      @click="$store.commit('vrm/setMotionNum',2)"
                    >
                      <img src="../../assets/img/icons/rise.png" height="30" width="30"/>
                    </button>
                    <button
                      class="btn btn-outline-light"
                      @click="$store.commit('vrm/setMotionNum',3)"
                    >
                      <img src="../../assets/img/icons/hello.png" height="30" width="30"/>
                    </button>
                    <button
                      class="btn btn-outline-light"
                      @click="$store.commit('vrm/setMotionNum',4)"
                    >
                      <img src="../../assets/img/icons/peace.png" height="30" width="30"/>
                    </button>
                    <button
                      class="btn btn-outline-light"
                      @click="$store.commit('vrm/setMotionNum',5)"
                    >
                      <img src="../../assets/img/icons/good.png" height="30" width="30"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RemoteVideo/>
        </div>
      </div>
    </div>
    <FocusVideo/>
    <WebRTC ref="WebRTC" :local-stream="localStream" :audio-track="audioTrack" @getStream="getUserVideoStream"/>
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
      this.$store.commit('video/setBroadcastStream', stream);
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
<style>
body {
  background: skyblue;
}

.background {
  position: fixed;
  z-index: 0;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
}
</style>
