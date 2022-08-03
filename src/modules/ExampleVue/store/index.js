import Vue from 'vue';
import Vuex from 'vuex';
import Module from 'ExampleVue/module';

Vue.use(Vuex);

const defaultState = () => ({
  selected: [],
  columns: [
    {
      name: 'id', label: 'ID', field: 'id', sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: 'Dessert (100g serving)',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: true,
    },
    {
      name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true,
    },
    {
      name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true,
    },
    { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
    { name: 'protein', label: 'Protein (g)', field: 'protein' },
    { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
    {
      name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    {
      name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
  ],
  data: [
    {
      id: 1,
      name: 'Frozen Yogurt',
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      sodium: 87,
      calcium: '14%',
      iron: '1%',
    },
    {
      id: 2,
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9.0,
      carbs: 37,
      protein: 4.3,
      sodium: 129,
      calcium: '8%',
      iron: '1%',
    },
    {
      id: 3,
      name: 'Eclair',
      calories: 262,
      fat: 16.0,
      carbs: 23,
      protein: 6.0,
      sodium: 337,
      calcium: '6%',
      iron: '7%',
    },
    {
      id: 1,
      name: 'Cupcake',
      calories: 305,
      fat: 3.7,
      carbs: 67,
      protein: 4.3,
      sodium: 413,
      calcium: '3%',
      iron: '8%',
    },
    {
      id: 4,
      name: 'Gingerbread',
      calories: 356,
      fat: 16.0,
      carbs: 49,
      protein: 3.9,
      sodium: 327,
      calcium: '7%',
      iron: '16%',
    },
    {
      id: 5,
      name: 'Jelly bean',
      calories: 375,
      fat: 0.0,
      carbs: 94,
      protein: 0.0,
      sodium: 50,
      calcium: '0%',
      iron: '0%',
    },
    {
      id: 6,
      name: 'Lollipop',
      calories: 392,
      fat: 0.2,
      carbs: 98,
      protein: 0,
      sodium: 38,
      calcium: '0%',
      iron: '2%',
    },
    {
      id: 7,
      name: 'Honeycomb',
      calories: 408,
      fat: 3.2,
      carbs: 87,
      protein: 6.5,
      sodium: 562,
      calcium: '0%',
      iron: '45%',
    },
    {
      id: 8,
      name: 'Donut',
      calories: 452,
      fat: 25.0,
      carbs: 51,
      protein: 4.9,
      sodium: 326,
      calcium: '2%',
      iron: '22%',
    },
    {
      id: 9,
      name: 'KitKat',
      calories: 518,
      fat: 26.0,
      carbs: 65,
      protein: 7,
      sodium: 54,
      calcium: '12%',
      iron: '6%',
    },
  ],
  vTableHeader: [
    {
      key: '_vTableId',
      title: '№',
      width: '7%',
      filter: true,
      sort: true,
      template: (row, index) => {
        if (row.number % 2 !== 0) {
          return `<div style="color: red">${row._vTableId}<div>`;
        }
        return row._vTableId;
      },
    },
    {
      key: 'Url__c',
      title: 'Url',
      width: '28%',
      filter: true,
      sort: true,
    },
    {
      key: 'StatusCode__c',
      title: 'StatusCode',
      width: '10%',
      sort: true,
      filter: true,
    },
    {
      key: 'ClassName__c',
      title: 'ClassName',
      width: '20%',
      filter: true,
    },
    {
      key: 'date',
      title: 'Date',
      width: '20%',
      filter: true,
      sort: true,
      template(row, index) {
        if (row.date) {
          return row.date.toLocaleString();
        }
        return '-';
      },
    },
    {
      key: 'requestTime',
      title: 'Time',
      width: '15%',
      sort: true,
      filter: true,
    },
  ],
});

export default new Vuex.Store({
  state: defaultState(),
  actions: {
    select({ commit }, selected) {
      commit('select', selected);
      if (selected && selected.length) {
        const module = new Module();
        module.$$emit('onRowClick', selected);
      }
    },
  },
  mutations: {
    select(state, selected) {
      Vue.set(state, 'selected', selected);
    },
  },
});
