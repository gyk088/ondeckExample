<template>
  <div id="MainContent">
    <div class="q-pa-md">
      <q-table
        title="Treats"
        :data="data"
        :columns="columns"
        row-key="name"
        selection="single"
        :selected.sync="vSelected"
      />
    </div>
    <div
      id="Vtabel"
      ref="Vtabel"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import store from 'ExampleVue/store';
import vTable from 'tablevscroll';
import 'tablevscroll/table.min.css';

export default {
  name: 'VueApp',
  store,
  data() {
    return {
      vTable: null,
      vTabelData: [],
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.data,
      columns: (state) => state.columns,
      selected: (state) => state.selected,
      vTableHeader: (state) => state.vTableHeader,
    }),

    vSelected: {
      get() { return this.selected; },
      set(value) {
        this.select(value);
      },
    },
  },
  mounted() {
    this.vTable = new vTable({
      node: this.$refs.Vtabel,
      numberOfVisibleRows: 10,
      rowHeight: 32,
      header: this.vTableHeader,
      multiSelect: true,
      noDataText:  ' ',
      footer: {
        height: 32,
        content: 'No content',
      },
    });

    this.vTable.loadingStart();

    this.prepareData();

     setTimeout(() => {
        this.vTable.setData(this.vTabelData);
        this.vTable.setFooterContent('row count: ' + this.vTable.getRowCount());
        this.vTable.loadingStop();
    }, 1000)
  },
  methods: {
    ...mapActions(['select']),
    randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    prepareData() {
      const i = 0;

      for (let i = 0; i <= 99999; i++) {
        const date = this.randomDate(new Date(2021, 0, 1), new Date());
        this.vTabelData.push({
          ClassName__c: 'MyHttpRequest',
          LastAttemptDate__c: '2021-11-26T11:02:03.396Z',
          Method__c: 'POST',
          Name__c: '5-1637924524874',
          NumberOfAttempts__c: 0,
          QueryParam__c: 'check_point=1&lat=55.757901&lng=37.603381',
          Repeat__c: 0,
          StartRepeatDate__c: date.toString(),
          StatusCode__c: 502,
          Tik__c: date.toString(),
          Tok__c: date.setSeconds(date.getSeconds() + 3),
          Url__c: 'http://app.uxt-02.net-fi.com/cabstation/api/index.pl',
          Id: this.getRandomInt(9999),
          number: i,
          date,
          requestTime: Math.random(),
        });
      }
    },
  },
};
</script>

<style>

</style>
