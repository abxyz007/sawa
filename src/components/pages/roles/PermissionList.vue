<template>
  <v-dialog v-model="dialog" width="1200">
    <v-card>
      <validation-observer
          v-slot="{ handleSubmit }"
          ref="form"
      >
        <form @submit.prevent="handleSubmit(save)">
          <v-card-text class="">
            <v-row dense>
              <v-col
                  cols="12"
                  md="4"
                  v-for="(permission, index) in sitePermissionList"
                  :key="`role${index}`"
              >
                <div class="d-flex align-center">
                  <v-checkbox
                      class="mt-0"
                      :disabled="permissionsAdmin.length > 0"
                      v-model="permissionsSite"
                      :label="permission[`description_${$i18n.locale}`]"
                      hide-details
                      :value="permission.name"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider/>

          <v-card-actions>
            <v-spacer/>
            <v-btn text @click="dialog = false">{{ $t('cancel') }}</v-btn>
            <v-btn type="submit" color="success" :loading="loading">{{ $t('save') }}</v-btn>
          </v-card-actions>
        </form>
      </validation-observer>
    </v-card>
    <description-sub-modal
        ref="subModalRef"
        @changeDescription="changeDescription"
    />
  </v-dialog>
</template>

<script>
import DescriptionSubModal from "./DescriptionSubModal";

export default {
  name: "PermissionList",
  components: {DescriptionSubModal},
  data() {
    return {
      dialog: false,
      adminPermissionList: [],
      sitePermissionList: [],
      permissionsAdmin: [],
      permissionsSite: [],
      permissions: [],
      selectedAllAdmin: false,
      selectedAllSite: false,
      id: null,
      loading: false,
    }
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    changeDescription(val, name) {
      if(name === 'admin') {
        this.adminPermissionList.map(p => {
          if (val.id === p.id) {
            p.description_uz = val.description_uz
            p.description_ru = val.description_ru
          }
        })
      }
      if(name === 'site') {
        this.sitePermissionList.map(p => {
          if (val.id === p.id) {
            p.description_uz = val.description_uz
            p.description_ru = val.description_ru
          }
        })
      }
    },
    openSubModal(val, name) {
      const {subModalRef} = this.$refs
      subModalRef.openDialog(val, name)
    },
    save() {
      this.loading = true;
      this.permissions = [...this.permissionsAdmin, ...this.permissionsSite]
      this.$http.put(`roles/attach-permission/${this.id}`, {permissions: this.permissions})
          .then(() => {
            this.$setSuccess({text: this.$t('notify.update')});
            this.$emit('getData');
            this.dialog = false;
          })
          .catch(err => {
            this.$setErrorFromServer({error: err});
          })
          .finally(() => {
            this.loading = false;
          })
    },
    async selectAllAdmin() {
      if (this.selectedAllAdmin) {
        this.adminPermissionList.forEach(p => {
          this.permissionsAdmin.push(p.name);
        })
      } else {
        this.permissionsAdmin = []
      }
    },
    async selectAllSite() {
      if (this.selectedAllSite) {
        this.sitePermissionList.forEach(p => {
          this.permissionsSite.push(p.name);
        })
      } else {
        this.permissionsSite = []
      }
    },
    openDialog(item) {
      this.dialog = true;
      if (item) {
        if (item.permissions && item.permissions.length) {
          item.permissions.forEach(p => {
            if(p.type === 'admin') {
              this.permissionsAdmin.push(p.name);
            }
            if(p.type === 'site') {
              this.permissionsSite.push(p.name);
            }
          })
        }
        if (this.permissionsAdmin.length === this.adminPermissionList.length) {
          this.selectedAllAdmin = true
        }
        if (this.permissionsSite.length === this.sitePermissionList.length) {
          this.selectedAllSite = true
        }
        this.id = item.id;
      }
    },
    async getPermissionList() {
      try {
        const {data: {data}} = await this.$http.get('roles/permissions');
        this.adminPermissionList = data.admin;
        this.sitePermissionList = data.site;
      } catch (err) {
        this.$setErrorFromServer({error: err});
      }
    }
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.permissions = [];
        this.selectedAllSite = false;
        this.selectedAllAdmin = false;
        this.permissionsAdmin = [];
        this.permissionsSite = [];
        this.$refs.form.reset();
      }
    }
  }
}
</script>


<style>
.change-description {
  position: relative;
}
</style>