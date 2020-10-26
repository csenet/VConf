import * as THREE from 'three';

export const state = () => ({
  backgroundColor: '0xffffff',
  vrmModel: 're-ya.vrm',
  WebGLRenderer: THREE.WebGLRenderer
});

export const mutations = {
  changeBackgroundColor (state, { backgroundColor }) {
    state.backgroundColor = backgroundColor;
    state.WebGLRenderer.setClearColor(Number(backgroundColor));
  },
  changeVrmModel (state, { modelName }) {
    state.modelName = modelName;
  },
  getVrmModelPath (state) {
    return state.modelName;
  },
  setRenderer (state, { render }) {
    state.WebGLRenderer = render;
  }
};
