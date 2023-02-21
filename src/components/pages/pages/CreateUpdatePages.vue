<template>
  <v-dialog
      v-model="dialog"
      width="700"
  >
    <v-card>
      <v-card-title>
        {{ itemForm.id ? $t('update') : $t('create') }}
      </v-card-title>

      <v-divider />

      <v-card-text class="mt-3 pb-0">
        <ValidationObserver
            ref="form"
            v-slot="{handleSubmit}"
        >
          <v-form @submit.prevent="handleSubmit(saveItem)">
            <v-row dense>
              <v-col
                  cols="12"
                  md="6"
              >
                <validation-provider
                    rules="required|max:255"
                    :name="$t('title_ru')"
                    vid="title_ru"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('title_ru')"
                      outlined
                      dense
                      v-model="itemForm.title_ru"
                      :error-messages="props.errors[0]"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col
                  cols="12"
                  md="6"
              >
                <validation-provider
                    rules="required|max:255"
                    :name="$t('title_uz')"
                    vid="title_uz"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('title_uz')"
                      outlined
                      dense
                      v-model="itemForm.title_uz"
                      :error-messages="props.errors[0]"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col
                  cols="12"
                  md="6"
              >
                <validation-provider
                    rules="required|max:255"
                    :name="$t('title_en')"
                    vid="title_en"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('title_en')"
                      outlined
                      dense
                      v-model="itemForm.title_en"
                      :error-messages="props.errors[0]"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <validation-provider
                    rules="required"
                    :name="$t('type')"
                    vid="type"
                    v-slot="props"
                >
                  <v-autocomplete
                      outlined
                      dense
                      :label="$t('type')"
                      v-model="itemForm.type"
                      :items="typeList"
                      item-value="key"
                      item-text="name"
                      :error-messages="props.errors[0]"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <validation-provider
                    rules="required"
                    :name="$t('status')"
                    vid="id"
                    v-slot="props"
                >
                  <v-autocomplete
                      outlined
                      dense
                      :label="$t('status')"
                      v-model="itemForm.status"
                      :items="statusList"
                      item-value="key"
                      item-text="name"
                      :error-messages="props.errors[0]"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col
                  cols="12"
              >
                <validation-provider
                    rules="required|max:1000"
                    :name="$t('content_ru')"
                    vid="content_ru"
                    v-slot="props"
                >
                  <v-textarea
                      height="80"
                      :loading="formLoading"
                      :label="$t('content_ru')"
                      outlined
                      dense
                      v-model="itemForm.content_ru"
                      :error-messages="props.errors[0]"
                  ></v-textarea>
                </validation-provider>
              </v-col>

              <v-col
                  cols="12"
              >
                <validation-provider
                    rules="required|max:1000"
                    :name="$t('content_uz')"
                    vid="content_uz"
                    v-slot="props"
                >
                  <v-textarea
                      height="80"
                      :loading="formLoading"
                      :label="$t('content_uz')"
                      outlined
                      dense
                      v-model="itemForm.content_uz"
                      :error-messages="props.errors[0]"
                  ></v-textarea>
                </validation-provider>
              </v-col>
              <v-col
                  cols="12"
              >
                <validation-provider
                    rules="required|max:1000"
                    :name="$t('content_en')"
                    vid="content_en"
                    v-slot="props"
                >
                  <v-textarea
                      height="80"
                      :loading="formLoading"
                      :label="$t('content_en')"
                      outlined
                      dense
                      v-model="itemForm.content_en"
                      :error-messages="props.errors[0]"
                  ></v-textarea>
                </validation-provider>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            @click="dialog = false"
            text
        >
          {{ $t('cancel') }}
        </v-btn>
        <v-btn
            @click="saveItem"
            dark
            color="green"
            :loading="loading"
        >
          {{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import {getValueByKey} from "../../../utils/helperFunction";

const FORM = {
  title_ru: null,
  title_uz: null,
  title_en: null,
  content_ru: null,
  content_uz: null,
  content_en: null,
  type: null,
  status: null,
}
export default {
  name: "CreateUpdateSuppliers",
  data() {
    return {
      dialog: false,
      itemForm: {...FORM},
      typeList: [],
      loading: false,
      formLoading: false,
      statusList: [
        {
          key: 10,
          name: this.$t('active')
        },
        {
          key: 0,
          name: this.$t('not_active')
        },
      ],
    }
  },
  created() {
    this.getTypeList();
  },
  methods: {
    async openDialog(item) {
      this.dialog = true;
      if (item) {
        this.formLoading = true;
        this.itemForm.status = item.status;
        try {
          const {data: {data}} = await this.$http.get('pages/' + item.id)
          this.itemForm = getValueByKey(this.itemForm, data);
          this.itemForm.id = data.id;
        } catch (err) {
          this.$setErrorFromServer({error: err});
        } finally {
          this.formLoading = false;
        }
      }
    },
    async getTypeList() {
      try {
        const {data: {data}} = await this.$http.get('pages/types-list')
        this.typeList = data
      } catch (err) {
        this.$setErrorFromServer({error: err});
      }
    },
    saveItem() {
      if (this.itemForm.id) {
        this.changeItem();
      } else {
        this.createItem();
      }
    },
    createItem() {
      this.loading = true;
      let valid = this.$refs.form.validate();
      if (valid) {
        this.$http.post('pages', this.itemForm)
            .then(res => {
              if (res) {
                this.dialog = false;
                this.$emit('getPages')
                this.$setSuccess({text: this.$t('notify.save')});
              }
            })
            .catch(err => {
              this.$setErrorFromServer({error: err});
              this.$setFormError({error: err, obs: this.$refs['form']});
            })
            .finally(() => {
              this.loading = false;
            })
      }
    },
    changeItem() {
      let valid = this.$refs.form.validate();
      this.loading = true;
      if (valid) {
        this.$http.put('pages/' + this.itemForm.id, this.itemForm)
            .then(res => {
              if (res) {
                this.dialog = false;
                this.$emit('getPages');
                this.$setSuccess({text: this.$t('notify.update')});
              }
            })
            .catch(err => {
              this.$setErrorFromServer({error: err})
              this.$setFormError({error: err, obs: this.$refs['form']});
            })
            .finally(() => {
              this.loading = false;
            })
      }
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.itemForm = {...FORM};
        this.$refs.form.reset();
      }
    }
  }
}
</script>

<style scoped>

</style>