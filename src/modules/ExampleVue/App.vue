<template>
  <div id="MainContent">
    <div class="q-pa-md">
      <q-table
        title="Treats"
        :data="data"
        :columns="columns"
        row-key="name"
        selection="single"
        :selected-rows-label="getSelectedString"
        :selected.sync="vSelected"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import store from 'ExampleVue/store';
import Module from 'ExampleVue/module';

export default {
  el: '#MainContent',
  name: 'VueApp',
  store,
  computed: {
    ...mapState({
      data: (state) => state.data,
      columns: (state) => state.columns,
      selected: (state) => state.selected,
    }),

    vSelected: {
      get() { return this.selected; },
      set(value) { this.select(value); },
    },
  },
  methods: {
    ...mapMutations(['select']),

    getSelectedString() {
      module = new Module();
      module.$$emit('onRowClick', this.selected);
    },
  },
};
</script>

<style>

</style>
