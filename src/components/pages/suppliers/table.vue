<template>
  <div>
    <v-card class="pa-2">
      <v-data-table
          :headers="headers"
          :items="suppliers"
          hide-default-footer
          :items-per-page="total"
          class="elevation-0"
      >
        <template #top>
          <table-header @getSuppliers="$emit('getSuppliers')" :filters="filters" />
        </template>
        <template v-slot:item.created_at="props">
          {{ props.item.created_at | moment('YYYY.MM.DD') }}
        </template>
        <template #item.actions="{ item }">
          <table-actions
            :actions="actions"
            @editItem="editItem(item)"
            @deleteItem="deleteItem(item)"
            :can-mixin-edit="'customers update'"
            :can-mixin-delete="'customers delete'"
          />
        </template>
        <template #item.phone="{ item }">
          {{ item.phone | phone }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>


import TableHeader from "./tableHeader";
import TableActions from "../../ui/table-actions/TableActions";
export default {
  name: "SuppliersTable",
  components: {TableActions, TableHeader},
  props: {
    suppliers: {
      type: Array,
    },
    filters: {
      type: Object
    },
    total: {
      type: Number
    }
  },
  data() {
    return {
      dialog: false,
      onlySee: false,
      locationList: [],
      viewData: null,
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
    deleteItem(item) {
      this.$http.delete('customers/' + item.id)
          .then(res => {
            if (res) {
              this.$emit('getSuppliers')
              this.$setSuccess({text: this.$t('notify.delete')});
            }
          })
          .catch(err => {
            this.$setErrorFromServer({error: err});
          })
    },
    editItem(item) {
      this.$emit('editOpenDialog', item)
    },
  },
  computed: {
    headers() {
      return [
        {text: this.$t('name'),  value: 'name', width: '350px'},
        {text: this.$t('region'), value: 'region'},
        {text: this.$t('district'), value: 'district'},
        {text: this.$t('tin'), value: 'tin'},
        {text: this.$t('address'), value: 'address'},
        {text: this.$t('phone'), value: 'phone'},
        {text: this.$t('created_at'), value: 'created_at'},
        {text: this.$t('actions'), value: 'actions'},
      ]
    }
  },
  watch:{
    'itemForm.phone'(val){
       this.itemForm.phone = val.replace(/\D/g, "");
    },
    'itemForm.tin'(val){
      this.itemForm.tin = val.replace(/\D/g, "");
    },
  }
}
</script>

<style scoped>

</style>