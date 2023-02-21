<template>
  <div>
    <v-card-title class="px-0">
      <v-spacer/>
      <v-btn
          v-if="can('carousel create')"
          color="success"
          @click="create"
      >
        <v-icon left>mdi-plus</v-icon>
        Create
      </v-btn>
    </v-card-title>
    <v-card>
      <v-card-text>
        <v-data-table
            :headers="headers"
            :items="items"
            hide-default-footer
        >
          <template #item.image="{ item }">
            <v-card class="pa-1 my-1" width="80">
              <v-img height="60" width="100%" :src="item.image_url"/>
            </v-card>
          </template>
          <template #item.created_at="{ item }">
            <div>
              {{ item.created_at | moment('YYYY.MM.DD') }}
            </div>
          </template>
          <template #item.actions="{ item }">
            <table-actions
                @editItem="edit(item)"
                @deleteItem="deleteItem(item)"
                :can-mixin-edit="'carousel update'"
                :can-mixin-delete="'carousel delete'"
                :actions="actions"
            />
          </template>
          <template #item.status="{ item }">
            <v-chip
                :color="getStatus(item).color"
                small
                label
            >{{ getStatus(item).text }}</v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-pagination
        v-if="length > 1"
        v-model="params.page"
        :length="length"
        total-visible="7"
    />
    <create-and-update-carousel @getData="getCarousel" ref="carouselFormRef"/>
  </div>
</template>

<script>
import CreateAndUpdateCarousel from "../../components/pages/slider/CreateAndUpdate";
import TableActions from "../../components/ui/table-actions/TableActions";

export default {
  name: "carousel",
  components: {TableActions, CreateAndUpdateCarousel},
  data() {
    return {
      items: [],
      actions: {
        edit: true,
        delete: true,
        view: false
      },
      params: {
        page: 1
      },
      length: 0
    }
  },
  created() {
    this.$http.get('/administrators/mfi/index')
    this.getCarousel();
  },
  methods: {
    getStatus(item) {
      if(item.status === 10) {
        return {
          text: this.$t('statusList.active'),
          color: 'success'
        }
      }
      if(item.status === 0) {
        return {
          text: this.$t('statusList.notActive'),
          color: 'error'
        }
      }
    },
    create() {
      const {carouselFormRef} = this.$refs
      carouselFormRef.openDialog()
    },
    async getCarousel() {
      this.$showLoading();
      try {
        const {data: {data}} = await this.$http.get('carousel', {
          params: {
            page: this.params.page
          }
        });
        this.items = data;
      } catch (err) {
        this.$setErrorFromServer({error: err});
      } finally {
        this.$clearLoading();
      }
    },
    edit(item) {
      const {carouselFormRef} = this.$refs
      carouselFormRef.openDialog(item)
    },
    deleteItem(item) {
      this.$http.delete(`carousel/${item.id}`)
          .then(() => {
            this.$setSuccess({text: this.$t('notify.delete')});
            this.getCarousel();
          })
          .catch(err => {
            this.$setErrorFromServer({error: err});
          })
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'Title',
          value: `title_${this.$i18n.locale}`
        },
        {
          text: 'Order',
          value: 'order'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Actions',
          value: 'actions'
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>