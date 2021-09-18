<template>
  <div/>
</template>
<script>
import Peer from 'skyway-js';
import { config } from '~/config.ts';

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['audioTrack'],
  data: () => {
    return {
      roomName: '',
      peer: '',
      room: '',
      displayStream: ''
    };
  },
  mounted () {
    this.peer = new Peer({
      key: config.apiKey,
      debug: 3
    });
    if (this.$nuxt.$route.query.room) {
      this.roomName = this.$nuxt.$route.query.room;
    }
  },
  computed: {
    localStream () {
      return this.$store.state.video.broadcastStream;
    }
  },
  watch: {
    localStream (stream) {
      if (this.room) {
        this.room.replaceStream(stream);
      }
    }
  },
  methods: {
    connect () {
      if (this.audioTrack > 0) {
        this.localStream.addTrack(this.audioTrack);
      }
      this.room = this.peer.joinRoom(this.roomName, {
        mode: 'sfu',
        stream: this.localStream
      });
      this.room.once('open', () => {
        this.$toast.show('入室しました');
      });
      this.room.on('peerJoin', (peerId) => {
        this.$toast.show(peerId + 'が入室しました');
      });
      this.room.on('stream', (stream) => {
        if (!this.$store.state.video.videoStreams.some(peer => peer.peerId === stream.peerId)) {
          this.$store.commit('video/addVideo', {
            id: stream.peerId,
            mediaStream: stream
          });
        }
      });
      this.room.on('peerLeave', (peerId) => {
        this.$toast.show(peerId + 'が退室しました');
        this.$store.commit('video/removeVideo', { id: peerId });
        if (peerId === this.$store.state.video.focusVideo.peerId) {
          this.$store.commit('video/resetFocusVideo');
        }
      });
    },
    async startMirror () {
      try {
        this.displayStream = await navigator.mediaDevices.getDisplayMedia();
      } catch {
        alert('画面共有を開始できません');
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.$store.commit('video/setBroadcastStream', this.displayStream);
      // this.$emit('getStream', this.displayStream);
      this.$store.commit('video/setUserVideo', this.displayStream);
      if (this.audioTrack !== -1) {
        this.localStream.addTrack(this.audioTrack);
      }
    },
    mute () {
      this.localStream.getAudioTracks()[0].enabled = false;
    },
    unmute () {
      this.localStream.getAudioTracks()[0].enabled = true;
    },
    send (axis) {
      this.room.send(axis);
    },
    close () {
      this.$store.commit('video/removeAllVideo');
      this.room.close();
      this.$toast.show('退室しました');
      this.$store.commit('video/resetFocusVideo');
    }
  }
};
</script>
