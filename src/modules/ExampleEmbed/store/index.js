import Vue from 'vue';
import Vuex from 'vuex';
import Module from 'ExampleEmbed/module';

Vue.use(Vuex);

const defaultState = () => ({
  data: '',
});

export default new Vuex.Store({
  state: defaultState(),
  mutations: {
    setData (state, str) {
      module = new Module()
      module.$$emit('notify', `${state.data} + ${str}`)
      Vue.set(state, 'data', `${state.data} + ${str}`);
    },
  },
});
