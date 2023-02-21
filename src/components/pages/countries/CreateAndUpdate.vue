<template>
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <v-card-title>
        {{ form.id ? $t('update') : $t('create') }}
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
                    :name="$t('code')"
                    v-slot="{ errors }"
                    vid="code"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.code"
                      :label="$t('code')"
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
                      clearable
                      :items="STATUS_KEYS"
                      item-text="text"
                      item-value="value"
                  />
                </validation-provider>
              </v-col>

              <v-col cols="12" md="6">
                <div>
                  <v-file-input
                      :loading="iconLoading"
                      v-if="!icon_url && !iconName"
                      v-model="form.icon"
                      :label="$t('icon')"
                      outlined
                      @change="uploadFile"
                      dense
                  />
                  <v-card v-if="iconName">
                    <v-chip
                        color="white"
                        label
                        style="height: 40px"
                    >
                      {{ iconName }}
                    </v-chip>
                    <v-btn
                        small
                        fab
                        absolute
                        style="top: -10px; right: -10px"
                        color="error"
                        width="24"
                        height="24"
                        @click="removeUpdateIcon"
                    >
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </v-card>
                  <v-card
                      class="pa-1"
                      v-if="icon_url && !iconName"
                  >
                    <v-img
                        width="100%"
                        height="80"
                        :src="icon_url"
                    />
                    <v-btn
                        small
                        fab
                        absolute
                        style="bottom: 0; left: 50%; transform: translateX(-50%)"
                        color="error"
                        width="24"
                        height="24"
                        @click="removeImage"
                    >
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </v-card>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <v-switch

                    v-model="form.resident"
                    :label="$t('resident')"
                    class="mt-1"
                    color="primary"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer/>
            <v-btn text @click="dialog = false">{{ $t('cancel') }}</v-btn>
            <v-btn color="success" type="submit" :loading="loading" :disabled="iconLoading">{{ $t('save') }}</v-btn>
          </v-card-actions>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import {STATUS} from "../../../utils/constants";
import {getValueByKey} from "../../../utils/helperFunction";

const form = {
  name_uz: null,
  name_ru: null,
  name_en: null,
  status: null,
  resident: null,
  icon: null,
  code: null,
}

export default {
  name: "CreateAndUpdateCountries",
  data() {
    return {
      dialog: false,
      form: {...form},
      test: null,
      loading: false,
      image_url: null,
      icon_url: null,
      iconName: null,
      iconLoading: false
    }
  },
  methods: {
    async uploadFile(e) {
      this.iconLoading = true;
      try {
        const data = await this.$store.dispatch('fileUploader', {key: 'file', file: e});
        this.form.icon = data.file
        this.icon_url = data.url
      } catch (err) {
        await this.$setErrorFromServer({error: err});
      } finally {
        this.iconLoading = false;
      }
    },
    removeUpdateIcon() {
      this.form.icon = null;
      this.iconName = null;
      this.icon_url = null;
    },
    removeImage() {
      this.$store.dispatch('removeFile', this.form.icon);
      this.icon_url = null;
      this.form.icon = null;
      this.iconName = null
    },
    openDialog(item) {
      this.dialog = true;
      if (item) {
        this.form = getValueByKey(this.form, item);
        this.form.id = item.id;
        this.form.status = item.status
        this.iconName = item.icon
      }
    },
    async save() {
      this.loading = true;
      this.form.resident ? this.form.resident = 1 : this.form.resident = 0
      try {
        if (this.form.id) {
          await this.$http.put(`countries/${this.form.id}`, this.form);
          this.$setSuccess({text: this.$t('notify.update')});
        } else {
          await this.$http.post('countries', this.form);
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
        this.form.icon = null;
        this.iconName = null;
        this.icon_url = null;
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