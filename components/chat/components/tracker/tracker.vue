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
    let render,
      tracker,
      vid,
      overlay,
      overlayCC,
      vidWidth,
      vidHeight,
      stack,
      analyser,
      frequencies,
      volume,
      isTracking,
      noseLength,
      noseLength2,
      counterX,
      counterY,
      counterZ,
      centerX,
      centerY,
      centerZ,
      isCameraEnable,
      emotions,
      previousValues;
    return {
      render,
      tracker,
      vid,
      overlay,
      overlayCC,
      vidWidth,
      vidHeight,
      stack,
      analyser,
      frequencies,
      volume,
      isTracking,
      noseLength,
      noseLength2,
      counterX,
      counterY,
      counterZ,
      isCameraEnable,
      emotions,
      previousValues,
      centerX,
      centerY,
      centerZ
    };
  },
  mounted () {
    this.vid = this.$refs.camera;
    this.overlay = this.$refs.cameraOverlay;
    this.overlayCC = this.overlay.getContext('2d');
    this.vidWidth = this.vid.width;
    this.vidHeight = this.vid.height;
    this.isTracking = false;
    this.previousValues = {
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

    this.stack = [];
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
      this.analyser = context.createAnalyser();
      this.frequencies = new Uint8Array(this.analyser.frequencyBinCount);
      window.hackForMozzila = stream;
      await context.createMediaStreamSource(stream).connect(this.analyser);
      this.$emit('getAudioTrack', stream.getAudioTracks()[0]);

      this.vid.muted = true;
      this.vid.srcObject = stream;
      await this.vid.play();
    },
    drawLoop () {
      requestAnimationFrame(this.drawLoop);
      this.overlayCC.clearRect(0, 0, this.vidWidth, this.vidHeight);
      let axis = {};
      const CurrentPosition = clmTracker.getCurrentPosition();
      if (CurrentPosition && this.isTracking) {
        const event = CurrentPosition;
        clmTracker.draw(this.overlay);
        if (
          this.centerX != null &&
          this.centerY != null &&
          this.centerZ != null
        ) {
          axis = util.mapEventTo3dTransforms(event, this.centerX, this.centerY, this.centerZ);
          axis = filter.maximumLimiter(axis); // 動く範囲の制限
          // axis = filter.moveLimiterXYZ(axis, this.previousValues); // 外れ値を除く
          axis = filter.getMovingAverage(axis, this.stack); // 移動平均
          axis.body_deg = util.getBodyDeg(event);
          axis.body_deg = filter.bodyDegLimiter(axis.body_deg);
        }
      }
      if (CurrentPosition) {
        // 表情認識
        const parameters = clmTracker.getCurrentParameters();
        const emotion = classifier.meanPredict(parameters);
        axis.emotion = emotion || undefined;
        this.emotions = axis.emotion;
      }
      // 口の動き
      if (this.analyser) {
        this.volume = Math.floor(util.getFrequency(this.frequencies, this.analyser));
        const threshold = 10; // 閾値以上の音を拾う
        this.volume = (this.volume - threshold) / (100 - threshold);
        axis.volume = this.volume;
      }
      if (axis === {}) {
        axis = 0;
      }
      this.$emit('axis', axis);
    },
    startTracking () {
      if (!this.isTracking) {
        if (this.vid != null) {
          this.vid.play();
          clmTracker.start(this.vid);
        }
        this.isTracking = true;
      }
    },
    stopTracking () {
      if (this.isTracking) {
        this.isTracking = false;
      }
    },
    initializeTilt () {
      // 初期設定
      if (clmTracker.getCurrentPosition() && this.isTracking) {
        const event = clmTracker.getCurrentPosition();
        const centerValue = 0.9; // 顔が正面のときのxDeg値
        // X軸方向の傾き
        const tops = (event[0][1] + event[14][1]) / 2;
        const bottoms = (event[6][1] + event[8][1]) / 2;
        const middle = bottoms + (tops - bottoms) / 2;
        this.centerX =
          Math.floor(
            ((((centerValue - event[37][1] / middle) / 0.2) * Math.PI) / 2) *
            100
          ) / 100;
        // Y軸方向の傾き
        this.centerY =
          Math.floor(
            -Math.atan(
              (event[33][0] - (event[25][0] + event[30][0]) / 2) /
              ((event[14][0] - event[0][0]) / 2)
            ) *
            4 *
            100
          ) / 100;
        // Z軸方向の傾き
        this.centerZ =
          Math.floor(
            Math.atan(
              (event[27][1] - event[32][1]) / (event[32][0] - event[27][0])
            ) *
            1.5 *
            100
          ) / 100;
      }
    }
  }
};
</script>
