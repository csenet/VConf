/* 各種ユーティリティ */

function getFrequency (frequencies, analyser) {
  // 周波数ごとの振幅を取得して配列に格納
  analyser.getByteFrequencyData(frequencies);
  return (
    frequencies.reduce(function (previous, current) {
      return previous + current;
    }) / analyser.frequencyBinCount
  );
}

function getBodyDeg (event) {
  const bodyX = 190;
  const bodyY = 198;
  if (event) {
    let deg =
      Math.PI / 2 +
      Math.atan2(event[62][1] - bodyY, event[62][0] - bodyX);
    if (event[7][1] > 290) {
      deg = deg / 5;
    }
    return -deg / 4.5;
  }
}

function mapEventTo3dTransforms (event, centerX, centerY, centerZ) {
  // 2次元座標から3次元の傾きを取得
  if (event) {
    const tops = (event[0][1] + event[14][1]) / 2;
    const bottoms = (event[6][1] + event[8][1]) / 2;
    const middle = bottoms + (tops - bottoms) / 2;
    const centerValue = 0.9; // 顔が正面のときのxDeg値
    const xDeg =
      (((centerValue - event[37][1] / middle) / 0.2) * Math.PI) / 2 -
      centerX;
    // Y軸方向の傾き
    const yDeg =
      -Math.atan(
        (event[33][0] - (event[25][0] + event[30][0]) / 2) /
        ((event[14][0] - event[0][0]) / 2)
      ) *
      4 -
      centerY;
    // Z軸方向の傾き
    const zDeg =
      Math.atan(
        (event[27][1] - event[32][1]) / (event[32][0] - event[27][0])
      ) *
      1.5 -
      centerZ;
    return {
      x: xDeg,
      y: yDeg,
      z: zDeg
    };
  }
}

export {
  getFrequency,
  getBodyDeg,
  mapEventTo3dTransforms
};
