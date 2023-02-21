<template>
  <div>
    <v-card class="pa-2">
      <v-data-table
          :headers="headers"
          :items="pages"
          :hide-default-footer="true"
          :items-per-page="15"
          class="elevation-0"
      >
        <template v-slot:item.created_at="props">
          {{ props.item.created_at | moment('YYYY.MM.DD') }}
        </template>
        <template #item.status="{ item }">
          <v-chip
              :color="getStatus(item).color"
              small
              label
          >{{ getStatus(item).text }}</v-chip>
        </template>
        <template #item.actions="{ item }">
          <table-actions
              :actions="actions"
              @editItem="editItem(item)"
              @deleteItem="deleteItem(item)"
              :can-mixin-edit="'pages update'"
              :can-mixin-delete="'pages delete'"
          />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import TableActions from "../../ui/table-actions/TableActions";
export default {
name: "TablePages",
  components: {TableActions},
  props: {
    pages: {
      type: Array,
    },
  },
  data() {
    return {
      dialog: false,
      locationList: [],
      params: {
        page: 1,
      },
      last_page: 0,
      actions: {
        delete: true,
        edit: true,
        view: false
      }
    }
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
    deleteItem(item) {
      this.$http.delete('pages/' + item.id)
          .then(res => {
            if (res) {
              this.$emit('getPages');
              this.$setSuccess({text: this.$t('notify.delete')});
            }
          })
          .catch(err => {
            this.$setErrorFromServer({error: err});
          })
    },
    editItem(item) {
      this.$emit('editOpenDialog', item);
    },
  },
  computed: {
    headers() {
      return [
        {text: this.$t('title'), sortable: false, value: `title_${this.$i18n.locale}`},
        {text: this.$t('type'), sortable: false, value: 'type'},
        {text: this.$t('created_at'), sortable: false, value: 'created_at'},
        {text: this.$t('status'), sortable: false, value: 'status'},
        {text: this.$t('actions'), sortable: false, value: 'actions'},
      ]
    }
  },
}
</script>

<style scoped>

</style>