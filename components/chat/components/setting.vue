<template>
  <div class="ViewModal">
    <div id="modal" class="container">
      <h3>設定</h3>
      <hr>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="modelSelect">モデル：</label>
            <select
              id="modelSelect"
              v-model="modelName"
              :disabled="isLoading"
              class="form-control"
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
          <div class="form-group">
            <label for="backgroundSelect">背景色：</label>
            <select
              id="backgroundSelect"
              v-model="color"
              class="form-control"
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
        <div class="col">
          <button class="btn btn-info" @click="close">
            閉じる
          </button>
        </div>
      </div>
    </div>
    <div id="overlay" />
  </div>
</template>
<script>
export default {
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
      ]
    };
  },
  methods: {
    mounted () {
      // this.color = this.$store.state.vrm.backgroundColor;
    },
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
  max-width: 400px;
  max-height: 70vh;
  box-sizing: border-box;
  padding: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  border: double 6px #58ffff44;
  box-shadow: 8px 15px 40px #1a251a65 inset;
  font-size: 2vw;
}
</style>
