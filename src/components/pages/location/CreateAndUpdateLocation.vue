<template>
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <v-card-title>
        {{ this.form.id ? $t('update') : $t('create') }}
      </v-card-title>
      <v-divider/>
      <validation-observer v-slot="{ handleSubmit }" ref="form">
        <form @submit.prevent="handleSubmit(save)">

          <v-card-text class="pb-0 pt-3">
            <v-row dense>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('name_uz')"
                    v-slot="{ errors }"
                    vid="name_uz"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.name_uz"
                      :label="$t('name_uz')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('name_ru')"
                    v-slot="{ errors }"
                    vid="name_ru"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.name_ru"
                      :label="$t('name_ru')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('name_en')"
                    v-slot="{ errors }"
                    vid="name_en"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.name_en"
                      :label="$t('name_en')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('codeRegion')"
                    v-slot="{ errors }"
                    vid="code"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.code"
                      v-mask="'+####'"
                      min="0"
                      :label="$t('codeRegion')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('status')"
                    v-slot="{ errors }"
                    vid="status"
                    rules="required"
                >
                  <v-select
                      :error-messages="errors[0]"
                      v-model="form.status"
                      :label="$t('status')"
                      outlined
                      dense
                      item-text="text"
                      item-value="value"
                      :items="STATUS_KEYS"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('reg_dis')"
                    v-slot="{ errors }"
                    vid="parent_id"
                >
                  <v-autocomplete
                      :error-messages="errors[0]"
                      v-model="form.parent_id"
                      :label="$t('reg_dis')"
                      outlined
                      dense
                      :item-text="`name`"
                      item-value="id"
                      :items="locationList"
                  >
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content>
                          <v-list-item-title v-html="data.item"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <template v-else>
                        <v-list-item-content>
                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer/>
            <v-btn text @click="dialog = false">{{ $t('cancel') }}</v-btn>
            <v-btn color="success" type="submit" :loading="loading">{{ $t('save') }}</v-btn>
          </v-card-actions>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import {getValueByKey} from "../../../utils/helperFunction";
import {STATUS} from "@/utils/constants";

const form = {
  name_uz: null,
  name_ru: null,
  name_en: null,
  code: null,
  status: null,
  parent_id: null
}

export default {
  name: "CreateAndUpdateLocation",
  data() {
    return {
      dialog: false,
      form: {...form},
      loading: false,
      locationList: []
    }
  },
  created() {
    this.getLocationList();
  },
  methods: {
    async getLocationList() {
      try {
        const {data: {data}} = await this.$http.get('locations/parents');
        data.forEach(parent => {
          this.locationList.push({name: parent.name_ru, group: parent.name_ru, id: parent.id});
          parent.children.forEach(child => {
            this.locationList.push({name: child.name_ru, group: parent.name_ru, id: child.id})
          });
          this.locationList.push({divider: true})
        })
        // this.locationList = data;
      } catch (err) {
        this.$setErrorFromServer({error: err});
      }
    },
    openDialog(item) {
      this.dialog = true;
      if (item) {
        this.form = getValueByKey(this.form, item);
        this.form.id = item.id;
        this.form.status = item.status
      }
    },
    async save() {
      if (this.form.code)
        this.form.code = this.form.code.replace(/\D/g, "")
      this.loading = true;
      try {
        if(this.form.id) {
          await this.$http.put(`locations/${this.form.id}`, this.form);
          this.$setSuccess({text: this.$t('notify.update')})
        } else {
          await this.$http.post('/locations', this.form);
          this.$setSuccess({text: this.$t('notify.save')});
        }
        this.dialog = false;
        this.$emit('getData');
      } catch (err) {
        this.$setFormError({error: err, obs: this.$refs['form']});
        this.$setErrorFromServer({error: err})
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.form = {...form};
        this.$refs.form.reset();
      }
    }
  },
  computed: {
    STATUS_KEYS() {
      let status = []
      Object.keys(STATUS).forEach(p => {
        status.push({value: +p, text: this.$t(`statusList.${STATUS[p]}`)})
      })
      return status
    }
  }
}
</script>

<style scoped>

</style>