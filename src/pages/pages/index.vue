<template>
  <div>
    <v-card-title class="px-0">
      {{ $t('pages') }}
      <v-spacer/>
      <v-btn
          color="success"
          @click="openDialog"
          v-if="can('pages create')"
      >
        <v-icon left>mdi-plus</v-icon>
        {{ $t('add') }}
      </v-btn>
    </v-card-title>

    <table-pages
        :filters="filters"
        :pages="pages"
        :items-per-page="total"
        @editOpenDialog="editOpenDialog"
        @getPages="getPages"
    />
    <pagination
        :params="params"
        :last-page="last_page"
        @getSuppliers="changePage"
        total-visible="7"
    />
    <create-update-pages
        ref="pagesRef"
        @getPages="getPages"
    />
  </div>
</template>

<script>
import Pagination from "@/components/ui/pagination/pagination";
import CreateUpdatePages from "@/components/pages/pages/CreateUpdatePages";
import TablePages from "../../components/pages/pages/table";
export default {
  name: "index",
  components: {TablePages, CreateUpdatePages, Pagination},
  data() {
    return {
      pages: [],
      params: {
        page: 1,
      },
      total: 0,
      last_page: 0,
      // locationList: [],
      filters: {}
    }
  },
  methods:{
    changePage(val) {
      this.$router.push({query: {page: val}});
      this.getPages();
    },
    openDialog() {
      const {pagesRef} = this.$refs
      pagesRef.openDialog()
    },
    editOpenDialog(item) {
      const {pagesRef} = this.$refs
      pagesRef.openDialog(item)
    },
    getPages() {
      const {page} = this.$route.query
      if(page) {
        this.params.page = +page;
      }
      this.$showLoading();
      this.$http.get('/pages', {
        params: {
          page: this.params.page,
          ...this.filters
        }
      })
          .then(res => {
            if (res.data.success) {
              this.pages = res.data.data;
              this.last_page = res.data.links.last_page;
              this.total = res.data.links.count;
            }
          })
          .catch(err => {
            this.$setErrorFromServer({error: err})
          })
          .finally(() => {
            this.$clearLoading();
          })
    },
  },
  mounted() {
    this.getPages();
  }
}
</script>

<style scoped>

</style>