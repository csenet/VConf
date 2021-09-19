<template>
  <div class="ViewModal">
    <div id="modal" class="container">
      <div class="d-flex justify-content-end fixed-top m-3">
        <button type="button" class="btn btn-close float-right" aria-label="Close" @click="close"/>
      </div>
      <h5>Settings</h5>
      <video
        :srcObject.prop="userStream"
        autoplay
        height="300"
        width="100%"
        loop
        muted
        playsinline
      />
      <div>
        <button class="btn btn-small btn-outline-primary" @click="startCamera">
          カメラを開始
          <font-awesome-icon icon="video"/>
        </button>
        <button class="btn btn-small btn-outline-primary" @click="startMirror">
          画面共有を開始
          <font-awesome-icon icon="desktop"/>
        </button>
      </div>
      <span class="text-muted">※画面共有中はアバターは表示されません</span>
      <hr>
      <div class="row">
        <div class="col">
          <div class="form-group my-1">
            <label for="modelSelect" class="form-label">モデル：</label>
            <select
              id="modelSelect"
              v-model="modelName"
              :disabled="isLoading"
              class="form-control-sm"
              @change="changeModel(modelName)"
            >
              <option disabled>
                選択してください
              </option>
              <option value="re-ya.vrm" selected="selected">
                れいやちゃん
              </option>
              <option value="JK.vrm" selected="selected">
                女子高生
              </option>
              <option value="sabaru.vrm">
                サーバルちゃん
              </option>
              <option value="neko.vrm">
                猫
              </option>
              <option value="shirohage.vrm">
                城禿君
              </option>
              <option value="shark.vrm">
                サメ君
              </option>
              <option value="reiwa_rei.vrm">
                令和の令
              </option>
              <option value="reiwa_wa.vrm">
                令和の和
              </option>
              <option value="mazyco.vrm">
                魔剤子
              </option>
            </select>
          </div>
          <div class="form-group my-1">
            <label for="backgroundSelect" class="form-label">背景色：</label>
            <select
              id="backgroundSelect"
              v-model="color"
              class="form-control-sm"
              @change="changeBackground(color)"
            >
              <option v-for="(i, index) in colors" :key="index" :value="i.color">
                {{ i.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        URLを共有して参加者を招待しよう！(Save to Clipboard)
        <a href="" disabled @click.prevent="saveClipboard(url)">{{ url }}</a>
      </div>
    </div>
    <div id="overlay"/>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['localStream', 'url'],
  data () {
    return {
      color: '',
      modelName: '',
      isLoading: false,
      colors: [
        {
          name: 'ベージュ',
          color: 0xFFEBCD
        },
        {
          name: '黄緑',
          color: 0x9CBB1C
        },
        {
          name: 'オレンジ',
          color: 0xFFA500
        },
        {
          name: '白',
          color: 0xFFFFFF
        }
      ],
      userVideoStream: MediaStream
    };
  },
  computed: {
    userStream () {
      return this.$store.getters['video/getUserVideo'];
    }
  },
  methods: {
    close () {
      this.$emit('close');
    },
    changeModel (modelName) {
      this.isLoading = true;
      this.modelName = modelName;
      // eslint-disable-next-line vue/custom-event-name-casing
      this.$emit('changeModel', modelName);
    },
    changeBackground (color) {
      this.$store.commit('vrm/changeBackgroundColor', { backgroundColor: color });
    },
    changeStatus () {
      this.isLoading = false;
    },
    startCamera () {
      this.$emit('startCamera');
    },
    saveClipboard (text) {
      navigator.clipboard.writeText(text);
    },
    startMirror () {
      this.$emit('startMirror');
    }
  }
};
</script>
<style>
#overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.65);
}

#modal {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  box-sizing: border-box;
  padding: 32px;
  background: white;
  font-size: 1em;
  overflow: scroll;
}
</style>
<style scoped>

video {
  background: lightgray;
}

select {
  width: 200px;
}
</style>
