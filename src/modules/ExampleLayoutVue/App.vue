<template>
  <div id="ROOT">
    <q-layout view="hhh lpR fFf">
      <q-header
        elevated
        class="bg-primary text-white"
      >
        <q-toolbar>
          <q-btn
            dense
            flat
            round
            icon="menu"
            @click="left = !left"
          />

          <q-toolbar-title>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
            </q-avatar>
            Title
          </q-toolbar-title>

          <q-space />
          <q-btn
            dense
            flat
            icon="new_releases"
            @click="showGlobalWnd()"
          />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="left"
        side="left"
        overlay
        bordered
      >
        <q-list
          bordered
          separator
        >
          <div
            v-for="(m, url) in config.modules"
            :key="url"
          >
            <q-item
              v-if="!m.global"
              v-ripple
              clickable
              @click="rout(`/${url}`)"
            >
              <q-item-section>{{ m.name }}</q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-drawer>

      <q-page-container>
        <div id="MainContent" />
        <div id="Embed" />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import Module from 'ExampleLayoutVue/module';

export default {
  el: '#ROOT',
  name: 'ExampleVueRoot',
  data() {
    return {
      left: false,
      config: {},
    };
  },
  created() {
    const module = new Module();
    this.config = module.$$config;
  },
  methods: {
    rout(url, state) {
      this.$emit('rout', {
        url, state,
      });

      this.left = false;
    },
    showGlobalWnd() {
      this.$emit('showGlobalWnd');
    },
  },
};
</script>
