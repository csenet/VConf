<template>
  <div id="Vrm">
    <!-- 3Dモデル表示 -->
    <div class="view">
      <p class="status">
        {{ status }}
      </p>
      <canvas ref="model" width="240" height="180"/>
    </div>
  </div>
</template>

<style>
.view {
  position: relative;
}

.view > .status {
  position: absolute;
  font-size: 18px;
  top: 4em;
  left: 0.5em;
  bottom: 0;
  text-align: center;
  margin: auto;
}
</style>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { VRM, VRMSchema, VRMUtils } from '@pixiv/three-vrm';

let currentVrm;

const speed = 1;

// time:global.motion_time(ずらせるようにtimeに),stopTime:台形の上端の長さ,haba:台形の下端の長さ
function trapezoid (time, stopTime, width) {
  // console.log(y);
  return -(Math.abs(time / 10 * speed + (stopTime - width / 2)) + Math.abs(time / 10 * speed - (stopTime + width / 2))) + width;
}

export default {
  name: 'Vrm',
  data () {
    let renderer, camera, clock, modelName, isAnimate, mixer, scene, timer;
    return {
      renderer,
      camera,
      scene,
      clock,
      status,
      modelName,
      isAnimate,
      mixer,
      timer
    };
  },
  mounted () {
    this.clock = new THREE.Clock();
    this.CreateRenderer();
    this.CreateCamera();
    this.CreateScene();
    this.status = 'モデルを選択してください';
    this.renderer.render(this.scene, this.camera);
    const canvas = this.$refs.model;
    const stream = canvas.captureStream(30);
    // eslint-disable-next-line vue/custom-event-name-casing
    this.$store.commit('video/setBroadcastStream', stream);
    this.$emit('getStream', stream);
    this.isAnimate = false;
    this.timer = 0;
  },
  computed: {
    motionNum () {
      return this.$store.getters['vrm/getMotionNum'];
    }
  },
  methods: {
    CreateRenderer () {
      // レンダラー
      const $canvas = this.$refs.model;
      /*
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: $canvas
      });
      */
      this.$store.commit('vrm/setRenderer', {
        render:
          new THREE.WebGLRenderer({
            antialias: true,
            canvas: $canvas
          })
      });
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: $canvas
      });
      this.renderer.setSize(240, 180);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0xFFEBCD);
    },
    changeBackground (color) {
      this.renderer.setClearColor(Number(color));
    },
    CreateCamera () {
      // カメラ
      this.camera = new THREE.PerspectiveCamera(
        30.0,
        window.innerWidth / window.innerHeight,
        0.1,
        20.0
      );
      this.camera.position.set(0.0, 1.2, 0.8);
      const controls = new OrbitControls(this.camera, this.$refs.model);
      controls.screenSpacePanning = true;
      controls.target.set(0.0, 1.0, 0.0);
      controls.update();
    },
    CreateScene () {
      // シーン
      this.scene = new THREE.Scene();
      // ライト
      const color = new THREE.Color('rgb(255, 255, 255)');
      const light = new THREE.DirectionalLight(color);
      light.position.set(1.0, 1.0, 1.0).normalize();
      this.scene.add(light);
    },
    DeleteModel () {
      this.scene.remove(currentVrm.scene);
    },
    LoadModels (modelName) {
      // モデル
      this.status = 'モデル読み込み中...';
      if (currentVrm) {
        this.DeleteModel();
      }
      const modelSrc = 'https://vconf.vercel.app/models/' + modelName; // 利用するモデルの配置場所
      const loader = new GLTFLoader();
      loader.crossOrigin = 'anonymous';
      loader.load(
        modelSrc,
        (gltf) => {
          VRM.from(gltf).then((vrm) => {
            this.status = '';
            VRMUtils.removeUnnecessaryJoints(gltf.scene);
            if (this.scene != null) {
              this.scene.add(vrm.scene);
            }
            currentVrm = vrm;
            vrm.scene.rotation.y = Math.PI;
            vrm.humanoid.getBoneNode(
              VRMSchema.HumanoidBoneName.RightUpperArm
            ).rotation.z = -(Math.PI / 2 - 0.3);
            vrm.humanoid.getBoneNode(
              VRMSchema.HumanoidBoneName.LeftUpperArm
            ).rotation.z = Math.PI / 2 - 0.3;
            vrm.humanoid.getBoneNode(
              VRMSchema.HumanoidBoneName.LeftHand
            ).rotation.z = 0.1;
            vrm.humanoid.getBoneNode(
              VRMSchema.HumanoidBoneName.RightHand
            ).rotation.z = -0.1;

            // eslint-disable-next-line vue/custom-event-name-casing
            this.$emit('finishLoading');
          });
        },
        progress =>
          console.log('モデルを読み込んでいます...',
            100.0 * (progress.loaded / progress.total),
            '%'),
        error => console.error(error)
      );
      this.renderer.render(this.scene, this.camera);
    },
    ChangeVrm (axis) {
      // 瞬き
      if (currentVrm) {
        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;

        const blinkVal =
          Math.sin((this.clock.elapsedTime) / 3) ** 1024 +
          Math.sin((this.clock.elapsedTime * 4) / 7) ** 1024;
        currentVrm.blendShapeProxy.setValue(
          VRMSchema.BlendShapePresetName.Blink,
          blinkVal
        );

        /* アニメーション */
        // アニメーションをするときはmotionNumを変更すればOK
        switch (this.motionNum) {
          case 0:
            this.timer = 0;
            this.set0(currentVrm);
            break;
          case 1:
            // だめ
            this.set1(1, 4, currentVrm, this.timer);
            break;
          case 2:
            // 手を挙げる
            this.set2(1, 4, currentVrm, this.timer);
            break;
          case 3:
            // 手をふる
            this.set3(1, 4, currentVrm, this.timer);
            break;
          case 4:
            // ピース
            this.set4(currentVrm, this.timer);
            break;
          case 5:
            // グッド
            this.set5(currentVrm, this.timer);
            break;
        }
        this.timer += 0.5;
      }
      // 基本的にはこの関数内を変えれば良い
      /*
      表情のトラッキング
      手の初分(挙手出来るようにするとか)
      */
      if (currentVrm && axis !== 0) {
        const deltaTime = this.clock.getDelta();
        console.log(axis.volume);
        currentVrm.blendShapeProxy.setValue(
          VRMSchema.BlendShapePresetName.O,
          axis.volume
        );
        // currentVrm.blendShapeProxy.setValue(
        //   VRMSchema.BlendShapePresetName.I,
        //   axis.volume * Math.random()
        // );
        //
        // currentVrm.blendShapeProxy.setValue(
        //   VRMSchema.BlendShapePresetName.U,
        //   axis.volume * Math.random()
        // );
        // currentVrm.blendShapeProxy.setValue(
        //   VRMSchema.BlendShapePresetName.E,
        //   axis.volume * Math.random()
        // );
        // currentVrm.blendShapeProxy.setValue(
        //   VRMSchema.BlendShapePresetName.O,
        //   axis.volume * Math.random()
        // );

        if (axis.x && axis.y && axis.z) {
          // ボーンをセットs
          currentVrm.humanoid.getBoneNode(
            VRMSchema.HumanoidBoneName.Neck
          ).rotation.x = axis.x;
          currentVrm.humanoid.getBoneNode(
            VRMSchema.HumanoidBoneName.Neck
          ).rotation.y = axis.y;
          currentVrm.humanoid.getBoneNode(
            VRMSchema.HumanoidBoneName.Neck
          ).rotation.z = axis.z;
          currentVrm.humanoid.getBoneNode(
            VRMSchema.HumanoidBoneName.Spine
          ).rotation.z = axis.body_deg;
        }
        if (axis.emotion !== undefined) {
          console.log(axis.emotion[5]);
          currentVrm.blendShapeProxy.setValue(
            VRMSchema.BlendShapePresetName.Fun,
            axis.emotion[5].value
          );
          // currentVrm.blendShapeProxy.setValue(
          //   VRMSchema.BlendShapePresetName.Sorrow,
          //   axis.emotion[3].value
          // );
          // currentVrm.blendShapeProxy.setValue(
          //   VRMSchema.BlendShapePresetName.Angry,
          //   axis.emotion[0].value
          // );
        }
        currentVrm.update(deltaTime);
      }
      if (this.renderer) {
        // VRMモデルを更新
        this.renderer.render(this.scene, this.camera);
      }
    },
    set0 (currentVrm) {
      // console.log(inputElem.value);
      // 右上腕
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.y =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z =
        -((Math.PI / 2) - 0.3) * 0.99;
      // 右ひじ
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.y =
        0;
      // 右手
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightHand).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightHand).rotation.y =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightHand).rotation.y =
        0;
      // 右親指
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbDistal).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbDistal).rotation.y =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbDistal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.y =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.y =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.z =
        0;
      // 右人差し指
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexDistal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexIntermediate).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexIntermediate).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.y =
        0;
      // 右中指
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleDistal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleIntermediate).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleProximal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleDistal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleIntermediate).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleProximal).rotation.z =
        0;
      // 右薬指
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingDistal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingIntermediate).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingProximal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingProximal).rotation.x =
        0;
      // 右小指
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleDistal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleIntermediate).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.x =
        0;
      // 左上腕
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.y =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.z =
        ((Math.PI / 2) - 0.3) * 0.99;
      // 左ひじ
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.x =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.z =
        0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.y =
        0;
      // 左手
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftHand).rotation.y =
        0;
    },
    // y:現在の台形のy座標,max:台形の上端のy座標の2倍
    set1 (stopTime, width, currentVrm, motionTime) {
      // だめ
      const max = (width - stopTime * 2) * 2;
      const max2 = (width - stopTime * 9) * 2;
      const y = trapezoid(motionTime, stopTime, width);
      const y2 = trapezoid(motionTime, stopTime * 4.5, width);
      if (y < 0) {
        this.$store.commit('vrm/setMotionNum', 0);
      }
      // 右上腕
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.x =
        0.4 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.y =
        1.4 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z =
        -((Math.PI / 2) - 0.3) * (0.99 - 0.49 * Math.sin(Math.PI * (y / max)));
      // 右ひじ
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.z =
        0.4 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.y =
        1.66 * Math.sin(Math.PI * (y / max));

      // 左
      // 上腕
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.x =
        0.2 * Math.sin(Math.PI * (y2 / max2));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.y =
        -1.2 * Math.sin(Math.PI * (y2 / max2));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.z =
        ((Math.PI / 2) - 0.3) * (0.99 - 0.59 * Math.sin(Math.PI * (y2 / max2)));
      // ひじ
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.z =
        -0.25 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.y =
        -2.2 * Math.sin(Math.PI * (y / max));
    },
    set2 (stopTime, width, currentVrm, motionTime) {
      const max = (width - stopTime * 2) * 3;
      const y = trapezoid(motionTime, stopTime, width);
      if (y < 0) {
        this.$store.commit('vrm/setMotionNum', 0);
      }
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z =
        -((Math.PI / 2) - 0.3) * (0.99 - 0.04 * Math.sin(Math.PI * (y / max)));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.x =
        ((Math.PI / 2) - 0.3) * 0.66 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.z =
        ((Math.PI / 2) - 0.3) * 1.8 * Math.sin(Math.PI * (y / max));// 0;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.x =
        -((Math.PI / 2) - 0.3) * 1.1 * Math.sin(Math.PI * (y / max));
      if (y < 20) {
        currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.y =
          0.5 * Math.sin(Math.PI * (y / max));
        currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightHand).rotation.y =
          -0.4 * Math.sin(Math.PI * (y / max));
      }
      return y;
    },
    set3 (stopTime, width, currentVrm, motionTime) {
      const time = motionTime * 4;
      stopTime = 10;
      const haba = 40;
      const y = this.set2(stopTime, haba, currentVrm, time);
      if (y >= 19.8) {
        currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerArm).rotation.y =
          0.5 - 0.4 * Math.sin(Math.PI * time / 20);

        currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightHand).rotation.y =
          0.4 * Math.sin(Math.PI * time / 20);
        currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightHand).rotation.x =
          0.4 * Math.abs(Math.cos(Math.PI * time / 40));
      }
    },
    set4 (currentVrm, motionTime) {
      const time = motionTime * 8;
      const stopTime = 3;
      const haba = 40;
      const y = this.set2(stopTime, haba, currentVrm, time);
      const max = (haba - stopTime * 2) * 2;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbDistal).rotation.y =
        -0.4 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.x =
        -0.7 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.y =
        -0.6 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.z =
        -1 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbProximal).rotation.x =
        -0.8 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightThumbProximal).rotation.y =
        -0.2 * Math.sin(Math.PI * (y / max));
      // 右人差し指
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.y =
        0.15 * Math.sin(Math.PI * (y / max));

      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingDistal).rotation.z =
        -1.3 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingIntermediate).rotation.z =
        -1.5 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingProximal).rotation.x =
        0.25 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingProximal).rotation.y =
        -0.2 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingProximal).rotation.z =
        -1.4 * Math.sin(Math.PI * (y / max));

      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleDistal).rotation.z =
        -1.3 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleIntermediate).rotation.z =
        -1.4 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.x =
        0.4 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.y =
        -0.3 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.z =
        -1.7 * Math.sin(Math.PI * (y / max));
    },
    set5 (currentVrm, motionTime) {
      const time = motionTime * 8;
      const stopTime = 3;
      const haba = 40;
      const y = this.set2(stopTime, haba, currentVrm, time);
      const max = (haba - stopTime * 2) * 2;
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightHand).rotation.x =
        Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightHand).rotation.y =
        -Math.sin(Math.PI * (y / max));

      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexDistal).rotation.z =
        -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexIntermediate).rotation.z =
        -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexIntermediate).rotation.x =
        -0.1 * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.z =
        -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.x =
        -0.12 * Math.sin(Math.PI * (y / max));

      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleDistal).rotation.z =
        -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleIntermediate).rotation.z =
        -((Math.PI / 2) - 0.25) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightMiddleProximal).rotation.z =
        -((Math.PI / 2) - 0.25) * Math.sin(Math.PI * (y / max));

      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingDistal).rotation.z =
        -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingIntermediate).rotation.z =
        -((Math.PI / 2) - 0.2) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingProximal).rotation.z =
        -((Math.PI / 2) - 0.2) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightRingProximal).rotation.x =
        0.1 * Math.sin(Math.PI * (y / max));

      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleDistal).rotation.z =
        -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleIntermediate).rotation.z =
        -((Math.PI / 2) - 0.15) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.z =
        -((Math.PI / 2) - 0.15) * Math.sin(Math.PI * (y / max));
      currentVrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.x =
        0.2 * Math.sin(Math.PI * (y / max));
    }
  }
}
;
</script>
