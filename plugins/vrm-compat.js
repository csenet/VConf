/**
 * VRM Compatibility Layer
 * 
 * This module provides a compatibility layer between the old @pixiv/three-vrm API
 * and the new @pixiv/three-vrm API.
 */

import * as THREE from 'three';
import { VRM } from '@pixiv/three-vrm';

// Define VRMSchema for compatibility with older code
export const VRMSchema = {
  HumanoidBoneName: {
    Hips: 'hips',
    Spine: 'spine',
    Chest: 'chest',
    UpperChest: 'upperChest',
    Neck: 'neck',
    Head: 'head',
    LeftEye: 'leftEye',
    RightEye: 'rightEye',
    Jaw: 'jaw',
    LeftUpperLeg: 'leftUpperLeg',
    LeftLowerLeg: 'leftLowerLeg',
    LeftFoot: 'leftFoot',
    LeftToes: 'leftToes',
    RightUpperLeg: 'rightUpperLeg',
    RightLowerLeg: 'rightLowerLeg',
    RightFoot: 'rightFoot',
    RightToes: 'rightToes',
    LeftShoulder: 'leftShoulder',
    LeftUpperArm: 'leftUpperArm',
    LeftLowerArm: 'leftLowerArm',
    LeftHand: 'leftHand',
    RightShoulder: 'rightShoulder',
    RightUpperArm: 'rightUpperArm',
    RightLowerArm: 'rightLowerArm',
    RightHand: 'rightHand',
    LeftThumbProximal: 'leftThumbProximal',
    LeftThumbIntermediate: 'leftThumbIntermediate',
    LeftThumbDistal: 'leftThumbDistal',
    LeftIndexProximal: 'leftIndexProximal',
    LeftIndexIntermediate: 'leftIndexIntermediate',
    LeftIndexDistal: 'leftIndexDistal',
    LeftMiddleProximal: 'leftMiddleProximal',
    LeftMiddleIntermediate: 'leftMiddleIntermediate',
    LeftMiddleDistal: 'leftMiddleDistal',
    LeftRingProximal: 'leftRingProximal',
    LeftRingIntermediate: 'leftRingIntermediate',
    LeftRingDistal: 'leftRingDistal',
    LeftLittleProximal: 'leftLittleProximal',
    LeftLittleIntermediate: 'leftLittleIntermediate',
    LeftLittleDistal: 'leftLittleDistal',
    RightThumbProximal: 'rightThumbProximal',
    RightThumbIntermediate: 'rightThumbIntermediate',
    RightThumbDistal: 'rightThumbDistal',
    RightIndexProximal: 'rightIndexProximal',
    RightIndexIntermediate: 'rightIndexIntermediate',
    RightIndexDistal: 'rightIndexDistal',
    RightMiddleProximal: 'rightMiddleProximal',
    RightMiddleIntermediate: 'rightMiddleIntermediate',
    RightMiddleDistal: 'rightMiddleDistal',
    RightRingProximal: 'rightRingProximal',
    RightRingIntermediate: 'rightRingIntermediate',
    RightRingDistal: 'rightRingDistal',
    RightLittleProximal: 'rightLittleProximal',
    RightLittleIntermediate: 'rightLittleIntermediate',
    RightLittleDistal: 'rightLittleDistal'
  },
  BlendShapePresetName: {
    Neutral: 'neutral',
    A: 'a',
    I: 'i',
    U: 'u',
    E: 'e',
    O: 'o',
    Blink: 'blink',
    Joy: 'joy',
    Angry: 'angry',
    Sorrow: 'sorrow',
    Fun: 'fun',
    LookUp: 'lookUp',
    LookDown: 'lookDown',
    LookLeft: 'lookLeft',
    LookRight: 'lookRight',
    BlinkL: 'blinkLeft',
    BlinkR: 'blinkRight'
  }
};

// Export VRMUtils for compatibility
export const VRMUtils = {
  removeUnnecessaryJoints: (scene) => {
    // In newer versions, this might not be needed or implemented differently
    // This is a simple pass-through for compatibility
    return scene;
  }
};

// Re-export VRM
export { VRM };

// Export default for convenience
export default {
  VRM,
  VRMSchema,
  VRMUtils
};
