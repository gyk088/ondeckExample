import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultState = () => ({
  data: ""
})

export default new Vuex.Store({
  state: defaultState(),
  mutations: {
    setData (state, str) {
      Vue.set(state, "data", `${state.data} + ${str}`)
    }
  }
})