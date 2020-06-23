<template>
  <div id="ROOT">
    <div class="auth">
      <q-btn
        size="22px"
        class="q-px-xl q-py-xs"
        color="purple"
        label="АВТОРИЗАЦИЯ"
        @click="auth"
      />
    </div>
  </div>
</template>

<script>

export default {
  el: '#ROOT',
  name: 'VueApp',
  methods: {
    auth() {
      this.$emit('onAuth');
    },
  },
};
</script>

<style scoped>
  .auth {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
