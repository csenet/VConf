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
        muted
      />
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
<script>
import clm from 'clmtrackr';
import Stats from 'stats.js';
import emotionClassifier from './emotionClassifier.js';
import * as util from './utility.js';

const stack = [];

function maximumLimiter (axis) {
  const limit = (70 / 180) * Math.PI;
  if (axis.x > limit) {
    axis.x = limit;
  }
  if (axis.y > limit / 2) {
    axis.y = limit / 2;
  }
  if (axis.z > limit) {
    axis.z = limit;
  }
  if (axis.x < -limit) {
    axis.x = -limit;
  }
  if (axis.y < -limit / 2) {
    axis.y = -limit / 2;
  }
  if (axis.z < -limit) {
    axis.z = -limit;
  }
  return axis;
}

// function moveLimiterXYZ (axis, prev) {
//   const maximumLimit = (20 / 180) * Math.PI;
//   const minimumLimit = (10 / 180) * Math.PI;
//   prev.x = 0;
//   prev.y = 0;
//   prev.z = 0;
//   let x, y, z;
//
//   if (
//     Math.abs(axis.x - prev.x) < maximumLimit &&
//     Math.abs(axis.x - prev.x) > minimumLimit
//   ) {
//     x = axis.x;
//     prev.x = x;
//   } else if (axis.x > prev.x) {
//     x = axis.x;
//   } else if (axis.x < prev.x) {
//     x = axis.x;
//   }
//   if (
//     Math.abs(axis.y - prev.y) < maximumLimit &&
//     Math.abs(axis.y - prev.y) > minimumLimit
//   ) {
//     y = axis.y;
//     prev.y = y;
//   } else if (axis.y > prev.y) {
//     y = axis.y;
//   } else if (axis.y < prev.y) {
//     y = axis.y;
//   }
//   if (
//     Math.abs(axis.z - prev.z) < maximumLimit &&
//     Math.abs(axis.z - prev.z) > minimumLimit
//   ) {
//     z = axis.z;
//     prev.z = z;
//   } else if (axis.z > prev.z) {
//     z = axis.z;
//   } else if (axis.z < prev.z) {
//     z = axis.z;
//   }
//   return {
//     x,
//     y,
//     z
//   };
// }

const bodyStack = [];

function bodyDegAverage (deg) {
// 5回分の移動平均を取り，なめらかにする
  let average = 0;
  const a = 10;
  if (bodyStack.length > a) {
    bodyStack.shift();
    bodyStack.push(deg);
    for (let i = 0; i < bodyStack.length; i++) {
      average += bodyStack[i];
    }
    average /= bodyStack.length;
    bodyStack.pop();
    bodyStack.push(average);

    return average;
  } else {
    bodyStack.push(deg);
    return deg;
  }
}

function moveLimiter (difference) {
  const limit = 0.1;
  if (Math.abs(difference) > limit) {
    if (difference > 0) {
      difference += limit;
    } else {
      difference -= limit;
    }
  }
  return difference;
}

function getMovingAverage (axis) {
  // 5回分の移動平均を取り，なめらかにする
  const averageAxis = {
    x: 0,
    y: 0,
    z: 0
  };
  const k = 5;

  if (stack.length > k) {
    // stack.shift();
    // stack.push(axis);

    const limitX = Math.abs(stack[k - 2].x - stack[k - 3].x);
    const limitY = Math.abs(stack[k - 2].y - stack[k - 3].y);
    const limitZ = Math.abs(stack[k - 2].z - stack[k - 3].z);

    const differenceX = Math.abs(
      stack[k - 1].x - stack[k - 2].x
    );
    const differenceY = Math.abs(
      stack[k - 1].y - stack[k - 2].y
    );
    const differenceZ = Math.abs(
      stack[k - 1].z - stack[k - 2].z
    );
    stack[k - 1].x = moveLimiter(
      limitX,
      differenceX,
      stack[k - 1].x,
      stack[k - 2].x
    );
    stack[k - 1].y = moveLimiter(
      limitY,
      differenceY,
      stack[k - 1].y,
      stack[k - 2].y
    );
    stack[k - 1].z = moveLimiter(
      limitZ,
      differenceZ,
      stack[k - 1].z,
      stack[k - 2].z
    );

    for (let i = 0; i < stack.length; i++) {
      averageAxis.x += stack[i].x;
      averageAxis.y += stack[i].y;
      averageAxis.z += stack[i].z;
    }
    averageAxis.x /= stack.length;
    averageAxis.y /= stack.length;
    averageAxis.z /= stack.length;
    stack.pop();
    stack.push(axis);
    return averageAxis;
  } else {
    stack.push(axis);
    return axis;
  }
}

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
    global.dataStack = [];
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
      this.$store.commit('video/setUserVideo', stream);
      this.$emit('getAudioTrack', stream.getAudioTracks()[0]);
      this.$emit('getStream', stream);
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
          axis = maximumLimiter(axis); // 動く範囲の制限
          // axis = moveLimiterXYZ(axis, this.previousValues); // 外れ値を除く
          axis = getMovingAverage(axis); // 移動平均
          global.body_deg = bodyDegAverage(global.body_deg);
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
        // const threshold = 10; // 閾値以上の音を拾う
        global.volume = global.volume / 30.0;
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

<style scoped>

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
  background: white;
}

#container {
  position: relative;
  width: 370px;
}
</style>
