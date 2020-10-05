<template>
  <div class="container">
    <div class="row">
      <div class="col-4 bg-dark">
        <setting/>
      </div>
      <div class="col-8 bg-info"></div>
    </div>
  </div>
</template>
<script>
import Setting from '~/components/chat/components/setting.vue';

export default {
  name: 'new',
  components: {
    Setting
  }
};
</script>
