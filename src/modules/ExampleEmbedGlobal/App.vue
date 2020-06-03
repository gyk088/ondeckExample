<template>
  <div
    id="Embed"
    class="embed-block"
  >
    <q-btn
      size="22px"
      class="q-px-xl q-py-xs"
      color="purple"
      :label="data"
      @click="$emit('notify')"
    />
  </div>
</template>

<script>
import store from 'ExampleEmbedGlobal/store';
import { mapState, mapMutations } from 'vuex';

export default {
  el: '#EmbedWnd',
  name: 'EmbedAppWnd',
  store,
  computed: {
    ...mapState({
      data: (state) => state.data,
    }),
  },
  methods: {
    ...mapMutations(['setData']),
  },
};
</script>

<style scoped>
  .embed-block {
    margin: 60px 80px;
    height: 100px;
  }
</style>
