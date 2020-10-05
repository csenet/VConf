/* 各種フィルタ */

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

function moveLimiterXYZ (axis, prev) {
  const maximumLimit = (20 / 180) * Math.PI;
  const minimumLimit = (10 / 180) * Math.PI;
  prev.x = 0;
  prev.y = 0;
  prev.z = 0;
  let x, y, z;

  if (
    Math.abs(axis.x - prev.x) < maximumLimit &&
    Math.abs(axis.x - prev.x) > minimumLimit
  ) {
    x = axis.x;
    prev.x = x;
  } else if (axis.x > prev.x) {
    x = axis.x;
  } else if (axis.x < prev.x) {
    x = axis.x;
  }
  if (
    Math.abs(axis.y - prev.y) < maximumLimit &&
    Math.abs(axis.y - prev.y) > minimumLimit
  ) {
    y = axis.y;
    prev.y = y;
  } else if (axis.y > prev.y) {
    y = axis.y;
  } else if (axis.y < prev.y) {
    y = axis.y;
  }
  if (
    Math.abs(axis.z - prev.z) < maximumLimit &&
    Math.abs(axis.z - prev.z) > minimumLimit
  ) {
    z = axis.z;
    prev.z = z;
  } else if (axis.z > prev.z) {
    z = axis.z;
  } else if (axis.z < prev.z) {
    z = axis.z;
  }
  return {
    x,
    y,
    z
  };
}

function bodyDegLimiter (bodyDeg) {
  if (bodyDeg > 0.3) {
    bodyDeg = 0.3;
  } else if (bodyDeg < -0.3) {
    bodyDeg = -0.3;
  }
  return bodyDeg;
}

function moveLimiter (limit, difference, after, before) {
  if (difference < limit * 2 || difference > 0.001) {
    after = before;
  } else if (after > before) {
    after = before + limit;
  } else {
    after = before - limit;
  }
  return after;
}

function getMovingAverage (axis, stack) {
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

export {
  maximumLimiter,
  moveLimiterXYZ,
  bodyDegLimiter,
  getMovingAverage
};
