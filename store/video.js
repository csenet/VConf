export const state = () => ({
  userVideoStream: MediaStream,
  videoStreams: [],
  focusVideo: {
    peerId: String,
    mediaStream: MediaStream
  }
});

export const mutations = {
  setUserVideo (state, stream) {
    state.userVideoStream = stream;
  },
  addVideo (state, {
    mediaStream,
    id
  }) {
    state.videoStreams.push({
      peerId: id,
      stream: mediaStream
    });
  },
  removeVideo (state, { id }) {
    state.videoStreams = state.videoStreams.filter(stream => stream.peerId !== id);
  },
  removeAllVideo (state) {
    state.videoStreams = [];
  },
  setFocusVideo (state, {
    id,
    stream
  }) {
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
