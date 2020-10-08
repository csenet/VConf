// ボーンの初期化,今後作るモーションによっては中身が増えるかも
function set0 (currentVrm, THREE) {
  // console.log(inputElem.value);
  // 右上腕
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.y =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z =
    -((Math.PI / 2) - 0.3) * 0.99;
  // 右ひじ
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.y =
    0;
  // 右手
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand).rotation.y =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand).rotation.y =
    0;
  // 右親指
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbDistal).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbDistal).rotation.y =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbDistal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.y =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.y =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.z =
    0;
  // 右人差し指
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexDistal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexIntermediate).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexIntermediate).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.y =
    0;
  // 右中指
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleDistal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleIntermediate).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleProximal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleDistal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleIntermediate).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleProximal).rotation.z =
    0;
  // 右薬指
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingDistal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingIntermediate).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingProximal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingProximal).rotation.x =
    0;
  // 右小指
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleDistal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleIntermediate).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.x =
    0;
  // 左上腕
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.y =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.z =
    ((Math.PI / 2) - 0.3) * 0.99;
  // 左ひじ
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.x =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.z =
    0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.y =
    0;
  // 左手
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftHand).rotation.y =
    0;
}

// time:motion_time(ずらせるようにtimeに),stop_time:台形の上端の長さ,haba:台形の下端の長さ
function trapezoid (time, stopTime, width) {
  const y = -(Math.abs(time / 10 * speed + (stopTime - width / 2)) + Math.abs(time / 10 * speed - (stopTime + width / 2))) + width;
  // console.log(y);
  return y;
}

// y:現在の台形のy座標,max:台形の上端のy座標の2倍
function set1 (stopTime, width) {
  const max = (width - stopTime * 2) * 2;
  const max2 = (width - stopTime * 9) * 2;
  const y = trapezoid(motion_time, stopTime, width);
  const y2 = trapezoid(motion_time, stopTime * 4.5, width);
  if (y < 0) {
    motion_num = 0;
  }
  // 右上腕
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.x =
    0.4 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.y =
    1.4 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z =
    -((Math.PI / 2) - 0.3) * (0.99 - 0.49 * Math.sin(Math.PI * (y / max)));
  // 右ひじ
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.z =
    0.4 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.y =
    1.66 * Math.sin(Math.PI * (y / max));

  // 左
  // 上腕
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.x =
    0.2 * Math.sin(Math.PI * (y2 / max2));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.y =
    -1.2 * Math.sin(Math.PI * (y2 / max2));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.z =
    ((Math.PI / 2) - 0.3) * (0.99 - 0.59 * Math.sin(Math.PI * (y2 / max2)));
  // ひじ
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.z =
    -0.25 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftLowerArm).rotation.y =
    -2.2 * Math.sin(Math.PI * (y / max));
}

function set_2 (stopTime, width) {
  const max = (width - stopTime * 2) * 2;
  const y = trapezoid(motion_time, stopTime, width);
  if (y < 0) {
    motion_num = 0;
  }
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z =
    -((Math.PI / 2) - 0.3) * (0.99 - 0.04 * Math.sin(Math.PI * (y / max)));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm).rotation.x =
    ((Math.PI / 2) - 0.3) * 0.66 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.z =
    ((Math.PI / 2) - 0.3) * 1.8 * Math.sin(Math.PI * (y / max));// 0;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.x =
    -((Math.PI / 2) - 0.3) * 1.1 * Math.sin(Math.PI * (y / max));
  if (y < 20) {
    currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.y =
      0.5 * Math.sin(Math.PI * (y / max));
    currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand).rotation.y =
      -0.4 * Math.sin(Math.PI * (y / max));
  }
  return y;
}

function set_3 () {
  time = motion_time * speed;
  const stop_time = 10;
  const haba = 40;
  const y = set_2(stop_time, haba);
  if (y >= 19.8) {
    currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm).rotation.y =
      0.5 - 0.4 * Math.sin(Math.PI * time / 20);

    currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand).rotation.y =
      0.4 * Math.sin(Math.PI * time / 20);
    currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand).rotation.x =
      0.4 * Math.abs(Math.cos(Math.PI * time / 40));
  }
}

function set_4 () {
  const stop_time = 3;
  const haba = 40;
  const y = set_2(stop_time, haba);
  const max = (haba - stop_time * 2) * 2;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbDistal).rotation.y =
    -0.4 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.x =
    -0.7 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.y =
    -0.6 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbIntermediate).rotation.z =
    -1 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbProximal).rotation.x =
    -0.8 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightThumbProximal).rotation.y =
    -0.2 * Math.sin(Math.PI * (y / max));
  // 右人差し指
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.y =
    0.15 * Math.sin(Math.PI * (y / max));

  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingDistal).rotation.z =
    -1.3 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingIntermediate).rotation.z =
    -1.5 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingProximal).rotation.x =
    0.25 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingProximal).rotation.y =
    -0.2 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingProximal).rotation.z =
    -1.4 * Math.sin(Math.PI * (y / max));

  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleDistal).rotation.z =
    -1.3 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleIntermediate).rotation.z =
    -1.4 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.x =
    0.4 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.y =
    -0.3 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.z =
    -1.7 * Math.sin(Math.PI * (y / max));
}

function set_5 () {
  const stop_time = 3;
  const haba = 40;
  const y = set_2(stop_time, haba);
  const max = (haba - stop_time * 2) * 2;
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand).rotation.x =
    1 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand).rotation.y =
    -Math.sin(Math.PI * (y / max));

  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexDistal).rotation.z =
    -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexIntermediate).rotation.z =
    -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexIntermediate).rotation.x =
    -0.1 * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.z =
    -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightIndexProximal).rotation.x =
    -0.12 * Math.sin(Math.PI * (y / max));

  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleDistal).rotation.z =
    -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleIntermediate).rotation.z =
    -((Math.PI / 2) - 0.25) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightMiddleProximal).rotation.z =
    -((Math.PI / 2) - 0.25) * Math.sin(Math.PI * (y / max));

  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingDistal).rotation.z =
    -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingIntermediate).rotation.z =
    -((Math.PI / 2) - 0.2) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingProximal).rotation.z =
    -((Math.PI / 2) - 0.2) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightRingProximal).rotation.x =
    0.1 * Math.sin(Math.PI * (y / max));

  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleDistal).rotation.z =
    -((Math.PI / 2) - 0.3) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleIntermediate).rotation.z =
    -((Math.PI / 2) - 0.15) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.z =
    -((Math.PI / 2) - 0.15) * Math.sin(Math.PI * (y / max));
  currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLittleProximal).rotation.x =
    0.2 * Math.sin(Math.PI * (y / max));
}

let speed = 1;

// Initial_Tilitで呼び出しています
function fps () {
  const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  let st;
  let et;
  let d;
  let count = 0;
  const max = 30;
  let fps = 0;
  var counter = function () {
    count++;
    if (count === 1) {
      st = new Date().getTime();
    }
    if (count === max) {
      et = new Date().getTime();
      d = et - st;
      fps = count / d * 1000;
      // ログに出力
      speed = 80 / fps;// ここを変えれば速さが変わるはず
      console.log('speed : ' + speed);
      count = 0;
      return;
    }
    requestAnimationFrame(counter);
  };
  requestAnimationFrame(counter);
  return 80 / (1 + fps);
}

export {
  set0,
  set1,
  set_2,
  set_3,
  set_4,
  set_5
}
