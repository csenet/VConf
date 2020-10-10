export const state = () => ({
  userVideoStream: MediaStream,
  videoStreams: [{
    peerId: String,
    mediaStream: MediaStream
  }],
  focusVideo: {
    peerId: String,
    mediaStream: MediaStream
  }
});

export const mutations = {
  setUserVideo (state, stream) {
    state.userVideoStream = stream;
  },
  addVideo (state, { stream, id }) {
    state.videoStreams.push({
      peerId: id,
      mediaStream: stream
    });
  },
  removeVideo (state, { id }) {
    state.videoStreams.filter(stream => stream.peerId !== id);
  },
  removeAllVideo (state) {
    state.videoStreams = [];
  },
  setFocusVideo (state, { id, stream }) {
    state.focusVideo.peerId = id;
    state.focusVideo.mediaStream = stream;
  },
  resetFocusVideo (state) {
    state.focusVideo = {
      peerId: '',
      mediaStream: undefined
    };
  }
};
