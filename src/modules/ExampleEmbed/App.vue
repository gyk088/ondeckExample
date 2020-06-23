<template>
  <div
    id="Embed"
    @click="notify"
  >
    <div class="embed-block">
      <q-parallax src="https://cdn.quasar.dev/img/parallax2.jpg">
        <h1>{{ data }}</h1>
      </q-parallax>
    </div>
  </div>
</template>

<script>
import store from 'ExampleEmbed/store';
import { mapState, mapMutations } from 'vuex';
import Module from 'ExampleEmbed/module';

export default {
  el: '#Embed',
  name: 'EmbedApp',
  store,
  computed: {
    ...mapState({
      data: (state) => state.data,
    }),
  },
  methods: {
    ...mapMutations(['setData']),
    notify() {
      const module = new Module()
      module.$$emit('notify', this.data)
    }
  },
};
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
