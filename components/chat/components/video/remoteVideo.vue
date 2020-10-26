<template>
  <div id="webrtc">
    <!-- ドロワーエリア -->
    <div class="l-drawer">
      <input id="drawerCheckbox" class="l-drawer__checkbox" type="checkbox">
      <!-- ドロワーアイコン -->
      <label class="l-drawer__icon" for="drawerCheckbox">
        <span class="l-drawer__icon-parts" />
      </label>
      <!-- 背景を暗く -->
      <label class="l-drawer__overlay" for="drawerCheckbox" />
      <!-- ドロワーメニュー -->
      <nav class="l-drawer__menu remoteStream">
        <Video
          v-for="(stream,key) in $store.state.video.videoStreams"
          :key="key"
          autoplay
          :stream="stream.stream"
          :peer-id="stream.peerId"
          @focused="focus"
        />
      </nav>
    </div><!-- /ドロワーメニュー -->
  </div>
</template>
<style lang="scss">

/*ドロワー*/
.l-drawer {
  position: relative;
  // inputのcheckboxは非表示
  &__checkbox {
    display: none;
  }

  // ハンバーガーアイコン
  &__icon {
    background: white;
    cursor: pointer;
    display: block;
    width: 56px;
    height: 60px;
    position: fixed;
    right: 0;
    // ハンバーガーアイコンの中の線
    &-parts,
    &-parts:before,
    &-parts:after {
      background-color: #000;
      display: block;
      width: 26px;
      height: 2px;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: auto;
    }

    &-parts:before,
    &-parts:after {
      content: " ";
    }

    &-parts:before {
      top: 16px
    }

    &-parts:after {
      top: -16px
    }
  }

  // ドロワーメニュー開いた時のメインエリアを暗く
  &__overlay {
    background: #000;
    opacity: 0;
    pointer-events: none; //ポインタの動作全部無効化
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
  }

  // ドロワーメニュー
  &__menu {
    background: #ffffff;
    color: #000;
    max-width: 100%;
    width: 320px;
    height: 100vh;
    overflow-y: auto; //スクロール
    -webkit-overflow-scrolling: touch; //スクロール（SP）
    position: fixed;
    top: 0;
    right: -320px;
  }

  // z-indexの指定（1がメインエリア）
  &__icon {
    z-index: 4;
  }

  &__menu {
    z-index: 3;
  }

  &__overlay {
    z-index: 2;
  }

  // チェックが入ったら（アイコンクリックしたら）
  &__checkbox:checked ~ {
    // ハンバーガーアイコン
    .l-drawer__icon {
      .l-drawer__icon-parts {
        background: transparent;
      }

      .l-drawer__icon-parts:before {
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        top: 0;
      }

      .l-drawer__icon-parts:after {
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        top: 0;
      }
    }

    // メインエリアを暗くする
    .l-drawer__overlay {
      opacity: 0.3;
      pointer-events: auto; //ポインタの動作デフォルトに戻す
    }

    // メニューをだす
    .l-drawer__menu {
      right: 0;
    }
  }

  // 動きをスムーズに
  &__icon-parts,
  &__icon-parts:after,
  &__icon-parts:before,
  &__overlay,
  &__menu {
    -webkit-transition: all .7s;
    transition: all .7s;
  }
}

#remoteStream {
  background: gray;
  margin: 0 auto;
}

.close {
  pointer-events: none;
  z-index: 1;
  width: 100%;
  height: 100%;
  transition: background-color .6s;
}

#navTgl:checked ~ .close {
  pointer-events: auto;
  background-color: rgba(0, 0, 0, .3);
}
</style>
<script>
import Video from '~/components/chat/components/video.vue';

export default {
  name: 'RemoteVideo',
  components: {
    Video
  },
  methods: {
    focus (...data) {
      this.$store.commit('video/setFocusVideo', {
        id: data[0],
        stream: data[1]
      });
    }
  }
};
</script>
