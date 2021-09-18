<template>
  <div class="container-fluid background">
    <div class="jumbotron bg-white m-5 text-center">
      <h1>V会議の使い方</h1>
      <p>
        あいうえお
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'howtouse'
};
</script>

<style scoped>

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
