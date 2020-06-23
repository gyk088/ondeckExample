<template>
  <div id="MainContent">
    <div class="auth">
      <div>
        <q-btn
          size="22px"
          class="q-px-xl q-py-xs"
          color="purple"
          label="404 Page not found, go to the main page"
          icon-right="sentiment_very_dissatisfied"
          @click="auth"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  el: '#MainContent',
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
    flex-direction: column;
  }
</style>
