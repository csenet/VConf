/* 各種ユーティリティ */

function getFrequency (frequencies) {
  // 周波数ごとの振幅を取得して配列に格納
  global.analyser.getByteFrequencyData(frequencies);
  return (
    frequencies.reduce(function (previous, current) {
      return previous + current;
    }) / global.analyser.frequencyBinCount
  );
}

function mapEventTo3dTransforms (event) {
  // 2次元座標から3次元の傾きを取得
  if (event) {
    const tops = (event[0][1] + event[14][1]) / 2;
    const bottoms = (event[6][1] + event[8][1]) / 2;
    const middle = bottoms + (tops - bottoms) / 2;
    const centerValue = 0.9; // 顔が正面のときのxDeg値
    const xDeg =
      (((centerValue - event[37][1] / middle) / 0.2) * Math.PI) / 2 -
      global.centerX;
    // Y軸方向の傾き
    const yDeg =
      -Math.atan(
        (event[33][0] - (event[25][0] + event[30][0]) / 2) /
        ((event[14][0] - event[0][0]) / 2)
      ) * 4 -
      global.centerY;
    // 体の傾きを求める(x軸)
    if (global.pre_eyes_center_x) {
      global.body_deg = (Math.atan((global.pre_eyes_center_x - ((event[32][0] + event[27][0]) / 2)) / (180 - (global.pre_eyes_center_y)))) * 0.3;
    } else {
      global.body_deg = 0;
    }
    // Z軸方向の傾き
    const zDeg =
      Math.atan(
        (event[27][1] - event[32][1]) / (event[32][0] - event[27][0])
      ) *
      1.5 -
      global.centerZ;
    return {
      x: xDeg,
      y: yDeg,
      z: zDeg
    };
  }
}

export {
  getFrequency,
  mapEventTo3dTransforms
};
