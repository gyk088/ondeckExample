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
      ></q-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import store from 'ExampleVue/store'

export default  {
  name: 'VueApp',
  el: '#MainContent',
  store: store,
  computed: {
    ...mapState({
      data: state => state.data,
      columns: state => state.columns,
      selected: state => state.selected,
    }),

    vSelected: {
      get() { return this.selected },
      set(value) {this.select(value)}
    }
  },
  methods: {
    ...mapMutations(['select']),

    getSelectedString () {
      this.$emit('onRowClick', this.selected)
    }
  }
}
</script>

<style>

</style>
