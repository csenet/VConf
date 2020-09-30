<template>
  <div class="container-fluid background">
    <div class="container">
      <div class="Mainbox">
        <div class="text-center">
          <h1>
            <span>V</span>会議
          </h1>
          <p class="text-muted">
            Make Your Conference More Fun!
          </p>
        </div>
        <div class="text-explain">
          <hr>V会議は
          <br>バーチャルアバターで会議に参加できる
          <br>新しいWeb会議システム
        </div>
        <hr>
        <div class="form-group mb-2">
          <label for="roomId">RoomID</label>
          <input
            id="roomId"
            v-model="roomId"
            type="text"
            class="form-control"
            placeholder="RoomID"
          >
        </div>
        <div class="form-group">
          <nuxt-link :to="{name:'chat',query:{room:roomId}}" class="btn btn-info">
            会議を開始
          </nuxt-link>
        </div>
        <small class="hoi">
          RoomIDは自身で設定することも可能ですが
          <br>セキュリティ上の観点から推奨しません
        </small>
      </div>
    </div>
  </div>
</template>
<style>
.Mainbox {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 30rem;
  text-align: center;
  padding: 1.5rem 4rem;
  background: rgba(255, 255, 255, 0.5);
  border: double 6px #58ffff44;
  border-radius: 10px;
  box-shadow: 8px 15px 40px #1a251a65 inset;
  height: 35em;
  overflow-y:  scroll;
}
.text-center h1 {
  font-size: 3rem;
  text-shadow: 6px 3px 5px silver;
  font-family: "Yu Mincho";
  font-weight: bold;
}
.text-center span {
  font-size: 5.5rem;
  font-family: "BIZ UDP明朝";
  font-weight: Bold;
  font-style: italic;
}
.text-muted {
  font-size: 1.1rem;
}
.text-explain {
  font-size: 1.0rem;
}
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
<script>
export default {
  data () {
    return {
      roomId: 'test'
    };
  },
  mounted () {
    this.roomId = Math.random().toString(32).substring(2);
  }
};
</script>
