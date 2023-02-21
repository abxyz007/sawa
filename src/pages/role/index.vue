<template>
  <div>
    <v-card-title class="px-0">
      <v-spacer/>
      <v-btn
          color="success"
          @click="create"
          v-if="can('create role')"
      >
        <v-icon left>mdi-plus</v-icon>
        New document form
      </v-btn>
    </v-card-title>

    <v-card>
      <v-card-text>
        <v-data-table
            :headers="headers"
            :items-per-page="total"
            :items="items"
            hide-default-footer
        >
          <template #item.created_at="{ item }">
            <div>
              {{ item.created_at | moment('YYYY.MM.DD') }}
            </div>
          </template>
          <template #item.roles="{ item }">
            <v-btn
                small
                color="primary"
                class="mr-2"
                v-if="can('atttach permission')"
                @click="openRolesDialog(item)"
            >
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
          </template>
          <template #item.actions="{ item }">
              <table-actions
                  @editItem="edit(item)"
                  @deleteItem="deleteItem(item)"
                  :can-mixin-edit="'update role'"
                  :can-mixin-delete="'delete role'"
                  :actions="actions"
              />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-pagination
        v-if="length > 1"
        v-model="params.page"
        :length="length"
        total-visible="7"
        @input="changePage"
    />
    <roles-create-update @getData="getRoles" ref="carouselFormRef"/>
    <permission-list @getData="getRoles" ref="permissionDialogRef" />
  </div>
</template>

<script>
import TableActions from "../../components/ui/table-actions/TableActions";
import RolesCreateUpdate from "../../components/pages/roles/RolesCreateUpdate";
import PermissionList from "../../components/pages/roles/PermissionList";

export default {
  name: "role",
  components: {PermissionList, RolesCreateUpdate, TableActions},
  data() {
    return {
      items: [],
      actions: {
        edit: true,
        delete: true,
        view: false
      },
      total: 0,
      params: {
        page: 1
      },
      length: 0
    }
  },
  created() {
    this.getRoles();
  },
  methods: {
    changePage(val) {
      this.$router.push({query: {page: val}});
      this.getRoles();
    },
    openRolesDialog(item) {
      const {permissionDialogRef} = this.$refs;
      permissionDialogRef.openDialog({...item})
    },
    create() {
      const {carouselFormRef} = this.$refs
      carouselFormRef.openDialog()
    },
    async getRoles() {
      const {page} = this.$route.query
      if(page) {
        this.params.page = +page;
      }
      this.$showLoading();
      try {
        const {data: {data, links}} = await this.$http.get('roles', {
          params: {
            page: this.params.page
          }
        });
        this.length = links.last_page;
        this.total = links.count;
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
      this.$http.delete(`roles/${item.id}`)
          .then(() => {
            this.$setSuccess({text: this.$t('notify.delete')});
            this.getRoles();
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
          text: 'Document name',
          value: 'name'
        },
        {
          text: 'Document size',
          value: 'name'
        },
        {
          text: 'Document preview',
          value: 'roles'
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>