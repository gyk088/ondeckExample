<template>
  <div id="Embed" @click="$emit('notify')">
    <div class="embed-block">
      <q-parallax src="https://cdn.quasar.dev/img/parallax2.jpg">
        <h1>{{ data }}</h1>
      </q-parallax>
    </div>
  </div>
</template>

<script>
import store from 'ExampleEmbed/store'
import { mapState, mapMutations } from 'vuex'

export default  {
  name: 'EmbedApp',
  el: '#Embed',
  store: store,
  computed: {
    ...mapState({
      data: state => state.data,

    }),

    vSelected: {
      get() { return this.selected },
      set(value) {this.select(value)}
    }
  },
  methods: {
    ...mapMutations(['setData']),
  }
}
</script>

<style scoped>
  .embed-block {
    border: 1px solid  #000;
    border-radius: 20px;
    cursor: pointer;
  }
  h1 {
    font-size: 40px;
    color: #FFF;
    font-weight: bold;
  }
</style>