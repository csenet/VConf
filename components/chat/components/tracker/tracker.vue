<template>
  <div id="Tracker">
    <!-- カメラ表示 -->
    <div id="container">
      <video
        id="camera"
        ref="camera"
        autoplay
        height="180"
        loop
        playsinline
        width="240"
      >
        <!-- <source src="~assets/test.mp4" /> -->
      </video>
      <canvas
        id="cameraOverlay"
        ref="cameraOverlay"
        height="180"
        width="240"
      />
      <!-- {{emotions}} -->
    </div>
  </div>
</template>
<style>
#cameraOverlay {
  position: absolute;
  top: 0;
  left: 0;
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

#camera {
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

#container {
  position: relative;
  width: 370px;
}
</style>
<script>
import clm from 'clmtrackr';
import Stats from 'stats.js';
import emotionClassifier from './emotionClassifier.js';
import * as filter from './filter.js';
import * as util from './utility.js';

require('./global.js');

// eslint-disable-next-line new-cap
const clmTracker = new clm.tracker({
  faceDetection: {
    useWebWorkers: false
  }
});

// eslint-disable-next-line new-cap
const classifier = new emotionClassifier();
classifier.init();

export default {
  name: 'Tracker',
  data () {
  },
  mounted () {
    global.vid = this.$refs.camera;
    global.overlay = this.$refs.cameraOverlay;
    global.overlayCC = global.overlay.getContext('2d');
    global.vidWidth = global.vid.width;
    global.vidHeight = global.vid.height;
    global.isTracking = false;
    global.previousValues = {
      x: 0,
      y: 0,
      z: 0
    };
    this.drawLoop();
    clmTracker.init();

    // fpsモニタリング用
    const stats = new Stats();
    document.body.appendChild(stats.domElement);
    // update stats on every iteration
    document.addEventListener(
      'clmtrackrIteration',
      function () {
        stats.update();
      },
      false
    );
    global.stack = [];
  },
  methods: {
    async startCamera () {
      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true
        })
        .catch(() => {
          alert('カメラが接続されていません');
        });
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      global.analyser = context.createAnalyser();
      global.frequencies = new Uint8Array(global.analyser.frequencyBinCount);
      window.hackForMozzila = stream;
      await context.createMediaStreamSource(stream).connect(global.analyser);
      this.$emit('getAudioTrack', stream.getAudioTracks()[0]);

      global.vid.muted = true;
      global.vid.srcObject = stream;
      await global.vid.play();
    },
    drawLoop () {
      requestAnimationFrame(this.drawLoop);
      global.overlayCC.clearRect(0, 0, global.vidWidth, global.vidHeight);
      let axis = {};
      const CurrentPosition = clmTracker.getCurrentPosition();
      if (CurrentPosition && global.isTracking) {
        const event = CurrentPosition;
        clmTracker.draw(global.overlay);
        if (
          global.centerX != null &&
          global.centerY != null &&
          global.centerZ != null
        ) {
          axis = util.mapEventTo3dTransforms(event, global.centerX, global.centerY, global.centerZ);
          axis = filter.maximumLimiter(axis); // 動く範囲の制限
          // axis = filter.moveLimiterXYZ(axis, previousValues); // 外れ値を除く
          axis = filter.getMovingAverage(axis, global.stack); // 移動平均
          global.body_deg = filter.bodyDegAverage(global.body_deg);
          axis.body_deg = global.body_deg;
        }
      }
      if (CurrentPosition) {
        // 表情認識
        const parameters = clmTracker.getCurrentParameters();
        const emotion = classifier.meanPredict(parameters);
        axis.emotion = emotion || undefined;
        global.emotions = axis.emotion;
      }
      // 口の動き
      if (global.analyser) {
        global.volume = Math.floor(util.getFrequency(global.frequencies, global.analyser));
        const threshold = 10; // 閾値以上の音を拾う
        global.volume = (global.volume - threshold) / (100 - threshold);
        axis.volume = global.volume;
      }
      if (axis === {}) {
        axis = 0;
      }
      this.$emit('axis', axis);
    },
    startTracking () {
      if (!global.isTracking) {
        if (global.vid != null) {
          global.vid.play();
          clmTracker.start(global.vid);
        }
        global.isTracking = true;
      }
    },
    stopTracking () {
      if (global.isTracking) {
        global.isTracking = false;
      }
    },
    initializeTilt () {
      // 初期設定
      if (clmTracker.getCurrentPosition() && global.isTracking) {
        const event = clmTracker.getCurrentPosition();
        const centerValue = 0.9; // 顔が正面のときのxDeg値
        // X軸方向の傾き
        const tops = (event[0][1] + event[14][1]) / 2;
        const bottoms = (event[6][1] + event[8][1]) / 2;
        const middle = bottoms + (tops - bottoms) / 2;
        global.centerX =
          Math.floor(
            ((((centerValue - event[37][1] / middle) / 0.2) * Math.PI) / 2) *
            100
          ) / 100;
        // Y軸方向の傾き
        global.centerY =
          Math.floor(
            -Math.atan(
              (event[33][0] - (event[25][0] + event[30][0]) / 2) /
              ((event[14][0] - event[0][0]) / 2)
            ) *
            4 *
            100
          ) / 100;
        // Z軸方向の傾き
        global.centerZ =
          Math.floor(
            Math.atan(
              (event[27][1] - event[32][1]) / (event[32][0] - event[27][0])
            ) *
            1.5 *
            100
          ) / 100;
        // 初期の両目の中心
        global.pre_eyes_center_x = (event[32][0] + event[27][0]) / 2;
        global.pre_eyes_center_y = (event[32][1] + event[27][1]) / 2;
      }
    }
  }
};
</script>
