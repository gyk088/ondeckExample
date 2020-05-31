<template>
  <div id="Embed">
    <div class="embed-block">
      <q-parallax src="https://cdn.quasar.dev/img/parallax2.jpg">
        <h1>EMBED</h1>
      </q-parallax>
    </div>
  </div>
</template>

<script>
export default  {
  name: 'EmbedApp',
  el: '#Embed',
}
</script>

<style scoped>
  .embed-block {
    border: 1px solid  #000;
    border-radius: 20px;
  }
</style>