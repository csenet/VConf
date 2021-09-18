<template>
  <div class="container-fluid background">
    <div class="box">
      <div class="title">
        <h1>
          <span>V</span>会議
        </h1>
        <p class="text-muted">
          Make Your Conference More Fun!
        </p>
      </div>
      <div class="explain">
        V会議はバーチャルアバターで会議に参加する新しいWeb会議システムです！
      </div>
      <!-- 入力欄 -->
      <hr>
      <div class="text-center">
        <b style="font-size:1.3em;">使い方</b>
      </div>
      <ul>
        <li><b>ホスト</b></li>
        <span class="list-item">以下からROOMを作成してURLを共有</span>
        <li><b>参加者</b></li>
        <span class="list-item">共有されたリンクを開こう</span>
      </ul>
      詳しくは
      <nuxt-link to="howtouse">ガイド</nuxt-link>
      を参照
      <hr>
      <div class="row g-2">
        <input
          id="roomId"
          v-model="roomId"
          type="text"
          class="form-control-lg text-center form-control"
          placeholder="RoomID"
          @keydown.enter="movePage"
        >
        <nuxt-link :to="{name:'chat',query:{room:roomId}}" class="btn btn-success btn-lg">
          CREATE ROOM
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roomId: 'test'
    };
  },
  mounted () {
    this.roomId = Math.random().toString(32).substring(2);
  },
  methods: {
    movePage () {
      location.href = '/chat?room=' + this.roomId;
    }
  }
};
</script>
<style scoped>
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  max-width: 30rem;
  width: 100vw;
  padding: 1.5rem 4rem;
  background: rgba(255, 255, 255, 0.9);
  /* border: double 6px #e6b01d44; */
  border-radius: 10px;
  height: auto;
}

.title {
  text-align: center;
}

.title h1 {
  font-size: 3rem;
  text-shadow: 6px 3px 5px silver;
  font-family: "Yu Mincho", serif;
  font-weight: bold;
}

.title span {
  font-size: 5.5rem;
  font-family: "BIZ UDP明朝", serif;
  font-weight: Bold;
  font-style: italic;
}

.list-item {
  display: block;
  text-indent: 0.5em;
}

/* 背景 */
.background {
  position: relative;
  height: 100vh;
  min-height: 300px;
  background-image: url("~assets/img/index/background.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  z-index: 0;
  overflow: hidden;
}

.background::before {
  content: "";
  background: inherit;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
}
</style>
