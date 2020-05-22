<template>
  <div id="ROOT">
    <div class="auth">
      <q-btn
        size="22px"
        class="q-px-xl q-py-xs"
        color="purple"
        label="АВТОРИЗАЦИЯ"
        @click='auth'
      />
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie"

export default  {
  name: 'VueApp',
  el: '#ROOT',
  methods: {
    auth () {
      Cookies.set("token", "1234")
      this.$emit('onAuth')
    }
  }
}
</script>

<style scoped>
  .auth {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
