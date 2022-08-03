<template>
  <div id="ROOT">
    <div class="ep_panel">
        <input type="file" class='ep_file' multiple @change="createPage">
        <a href="https://www.ilovepdf.com/pdf_to_jpg" target="_blank">Конвертировать pdf в jpg</a>
    </div>
     <div class="ep_wrapper">
        <div class="ep_page" v-for="(page, p) in pages" :key="p">
            <div class="ep_row" v-for="(row, i) in page" :key="p + '_' + i">
                <div class="ep_cell" v-for="k in row" :key="k">
                  <img class="ep_blah" src="#" :ref="k" v-show="files"/>
                </div>
            </div>
        </div>
     </div>
  </div>
</template>

<script>

export default {
  name: 'VueApp',
  data: () => ({
    files: null,
    pages: [],
  }),
  methods: {
    previewFiles() {
        let i = 0;
        for (const ref in this.$refs) {
            if (this.files[i]) {
              this.$refs[ref][0].src = URL.createObjectURL(this.files[i]);
            }
            i++;
        }
    },

    createPage(event) {
      this.files = event.target.files;
      if (!this.files && this.files.length) return;
      this.pages = [];
      let row = [];
      let page = [row];
      this.pages = [page];
      for (let k = 0; k < this.files.length; k++) {
          if (row.length === 3) {
            row = [k];
            page.push(row);
          } else {
            row.push(k);
          }

          if (page.length === 6) {
            page = [];
            this.pages.push(page);
          }
      }


      setTimeout(() => {
        this.previewFiles();
      }, 0);
    }
  },
};
</script>

<style scoped>
@media print {
    .ep_panel {
      display: none;
    }

    @page {
      padding: 0;
      margin: 0;
    }

    .ep_page {
      page-break-after: always;
      margin: 0;
    }
}

  .ep_panel {
    position: fixed;
     background-color: #FFF;
  }
  .ep_wrapper {
    margin: 0;
    padding: 0;
    font: 12pt "Tahoma";
    min-height: 100vh;
    background-color: #000;
  }
  .ep_page {
    width: 210mm;
    min-height: 297mm;
    margin: 0mm auto;
    background: white;
    padding: 11mm;
    clear: both;
    margin-bottom: 20px;
  }
  .ep_row {
    margin-top: 7mm;
    height: 40mm;
    clear: both;
  }
  .ep_row:first-child {
    margin-top: 0mm;
  }
  .ep_cell {
    width: 58mm;
    height: 40mm;
    background: #FFF;
    float: left;
    margin-left: 7mm;
  }
  .ep_cell:first-child {
    margin-left: 0mm;
  }
  .ep_blah {
    width: 58mm;
    height: 40mm;
    border: none;
  }
</style>
