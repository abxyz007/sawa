<template>
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <validation-observer v-slot="{ handleSubmit }" ref="form">
        <form @submit.prevent="handleSubmit(save)">
          <v-card-title>
            {{ form.id ? $t('update') : $t('create') }}
          </v-card-title>
          <v-divider/>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('name_uz')"
                    vid="name_uz"
                    v-slot="{ errors }"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      outlined
                      dense
                      :label="$t('name_uz')"
                      v-model="form.name_uz"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('name_ru')"
                    vid="name_ru"
                    v-slot="{ errors }"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      outlined
                      dense
                      :label="$t('name_ru')"
                      v-model="form.name_ru"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('name_en')"
                    vid="name_en"
                    v-slot="{ errors }"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      outlined
                      dense
                      :label="$t('name_en')"
                      v-model="form.name_en"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('status')"
                    vid="status"
                    v-slot="{ errors }"
                    rules="required"
                >
                  <v-autocomplete
                      :error-messages="errors[0]"
                      outlined
                      dense
                      :items="statusList"
                      item-value="value"
                      item-text="text"
                      :label="$t('status')"
                      v-model="form.status"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider/>
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
import {STATUS} from "../../../utils/constants";
import {getValueByKey} from "../../../utils/helperFunction";

const FORM = {
  name_uz: null,
  name_ru: null,
  name_en: null,
  status: null
}


export default {
  name: "CreateUpdatePurchaseType",
  data() {
    return {
      dialog: false,
      form: {...FORM},
      loading: false
    }
  },
  methods: {
    openDialog(item) {
      this.dialog = true;
      if (item) {
        this.form = getValueByKey(this.form, item)
        this.form.id = item.id;
        this.form.status = item.status;
      }
    },
    async save() {
      this.loading = true
      try {
        await this.$http.post('/purchase-type/create-or-update', this.form);
        this.$setSuccess({text: this.$t('notify.save')});
        this.dialog = false;
        this.$emit('addItemTable')
      } catch (err) {
        this.$setErrorFromServer({error: err});
        this.$setFormError({error: err, obs: this.$refs['form']})
      } finally {
        this.loading = false
      }
    }
  },
  computed: {
    statusList() {
      let arr = [];
      Object.keys(STATUS).forEach(p => {
        arr.push({value: +p, text: this.$t(`statusList.${STATUS[p]}`)})
      })
      return arr
    }
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.form = {...FORM};
        this.$refs.form.reset();
      }
    }
  }
}
</script>

<style scoped>

</style>