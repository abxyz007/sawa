<template>
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <v-card-title>
        {{ $t('roles') }}
      </v-card-title>
      <v-divider/>
<!--      <v-card-text class="pl-4">-->
<!--        <v-checkbox-->
<!--            hide-details-->
<!--            v-model="selectedAll"-->
<!--            @change="selectAll"-->
<!--            :label="$t('chooseAll')"-->
<!--        />-->
<!--      </v-card-text>-->
      <v-divider/>
      <validation-observer
          v-slot="{ handleSubmit }"
          ref="form"
      >
        <form @submit.prevent="handleSubmit(save)">
          <v-card-text class="pt-3">
              <v-row dense>
                <v-col
                    cols="12"
                    md="6"
                    v-for="(item, index) in permissionList"
                    :key="`role${index}`"
                >
                  <v-radio-group
                      v-model="roles"
                      class="d-flex align-center mt-0"
                      hide-details
                  >
                    <v-radio
                        class="mt-0"
                        :label="item"
                        hide-details
                        :value="item"
                    />
                  </v-radio-group>
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
  </v-dialog>
</template>

<script>

export default {
  name: "PermissionList",
  components: {},
  data() {
    return {
      dialog: false,
      permissionList: [],
      roles: null,
      selectedAll: false,
      id: null,
      loading: false,
    }
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    save() {
      this.loading = true;
      this.$http.put(`administrators/mfi/attach-role/${this.id}`, {roles: [this.roles]})
      .then(() => {
        this.$setSuccess({text: this.$t('notify.update')});
        this.$emit('getItems');
        this.dialog = false;
      })
      .catch(err => {
        this.$setErrorFromServer({error: err});
      })
      .finally(() => {
        this.loading = false;
      })
    },
    async selectAll() {
      if (this.selectedAll) {
        this.permissionList.forEach(p => {
          this.roles.push(p);
        })
      } else {
        this.roles = []
      }
    },
    openDialog(item) {
      this.dialog = true;
      if (item) {
        if(item.role && item.role.length) {
          this.roles = item.role[0]
        }
        // if(this.roles.length === this.permissionList.length) {
        //   this.selectedAll = true
        // }
        this.id = item.user_id;
      }
    },
    async getPermissionList() {
      try {
        const {data: {data}} = await this.$http.get('roles/list');
        this.permissionList = data;
      } catch (err) {
        this.$setErrorFromServer({error: err});
      }
    }
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.roles = [];
        this.selectedAll = false;
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