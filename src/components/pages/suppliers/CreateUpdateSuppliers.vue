<template>
  <v-dialog
      v-model="dialog"
      width="700"
  >
    <v-card>
      <v-card-title>
        {{ itemForm.id ? $t('update') : $t('create') }}
      </v-card-title>
      <ValidationObserver
          ref="form"
          v-slot="{handleSubmit}"
      >
        <v-form @submit.prevent="handleSubmit(saveItem)">

          <v-divider/>
          <v-card-text class="mt-3 pb-0">
            <v-row dense>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <validation-provider
                    rules="required|max:255"
                    :name="$t('name_uz')"
                    vid="name_uz"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('name_uz')"
                      outlined
                      dense
                      v-model="itemForm.name_uz"
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
                    rules="required|max:255"
                    :name="$t('name_ru')"
                    vid="name_ru"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('name_ru')"
                      outlined
                      dense
                      v-model="itemForm.name_ru"
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
                    rules="required|max:255"
                    :name="$t('name_en')"
                    vid="name_en"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('name_en')"
                      outlined
                      dense
                      v-model="itemForm.name_en"
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
                    rules="required|max:1000"
                    :name="$t('address_uz')"
                    vid="address_uz"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('address_uz')"
                      outlined
                      dense
                      v-model="itemForm.address_uz"
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
                    rules="required|max:1000"
                    :name="$t('address_ru')"
                    vid="address_ru"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('address_ru')"
                      outlined
                      dense
                      v-model="itemForm.address_ru"
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
                    rules="required|max:1000"
                    :name="$t('address_en')"
                    vid="address_en"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('address_en')"
                      outlined
                      dense
                      v-model="itemForm.address_en"
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
                    :name="$t('tin')"
                    vid="tin"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('tin')"
                      outlined
                      dense
                      v-mask="'#########'"
                      v-model="itemForm.tin"
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
                    rules="required|min:16"
                    :name="$t('phone')"
                    vid="phone"
                    v-slot="props"
                >
                  <v-text-field
                      :loading="formLoading"
                      :label="$t('phone')"
                      value="+998"
                      outlined
                      dense
                      v-model="itemForm.phone"
                      v-mask="'+998##-###-##-##'"
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
                    :name="$t('district')"
                    vid="id"
                    v-slot="props"
                >
                  <v-autocomplete
                      outlined
                      dense
                      :label="$t('district')"
                      v-model="itemForm.location_id"
                      :items="locationList"
                      item-value="id"
                      item-text="name"
                      :error-messages="props.errors[0]"
                  >
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item"></v-list-item-content>
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
                dark
                type="submit"
                color="green"
                :loading="loading"
            >
              {{ $t('save') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>

import {getValueByKey} from "../../../utils/helperFunction";

const FORM = {
  name_uz: null,
  name_ru: null,
  name_en: null,
  tin: null,
  address_uz: null,
  address_ru: null,
  address_en: null,
  phone: null,
  user_id: null,
  location_id: null,
}
export default {
  name: "CreateUpdateSuppliers",
  data() {
    return {
      dialog: false,
      itemForm: {...FORM},
      locationList: [],
      loading: false,
      formLoading: false
    }
  },
  created() {
    this.getLocationList();
  },
  methods: {
    async openDialog(item) {
      this.dialog = true;
      if (item) {
        this.formLoading = true;
        try {
          const {data: {data}} = await this.$http.get('customers/' + item.id)
          this.itemForm = getValueByKey(this.itemForm, data);
          this.itemForm.id = data.id;
        } catch (err) {
          this.$setErrorFromServer({error: err});
        } finally {
          this.formLoading = false;
        }
      }
    },
    async getLocationList() {
      try {
        const {data: {data}} = await this.$http.get('locations/parents')
        data.forEach(parent => {
          this.locationList.push({header: parent.name_ru});
          parent.children.forEach(child => {
            this.locationList.push({name: child.name_ru, group: parent.name_ru, id: child.id})
          });
          this.locationList.push({divider: true})
        })
      } catch (err) {
        this.$setErrorFromServer({error: err});
      }
    },
    saveItem() {
      if (this.itemForm.phone)
        this.itemForm.phone = this.itemForm.phone.replace(/\D/g, "")
      if (this.itemForm.id) {
        this.changeItem();
      } else {
        this.createItem();
      }
    },
    createItem() {
      this.loading = true;
      this.$http.post('customers', this.itemForm)
          .then(res => {
            if (res) {
              this.dialog = false;
              this.$emit('getSuppliers');
              this.$setSuccess({text: this.$t('notify.save')});
            }
          })
          .catch(err => {
            this.$setFormError({error: err, obs: this.$refs['form']});
          })
          .finally(() => {
            this.loading = false;
          })
    },
    changeItem() {
      this.loading = true;
      this.$http.put('customers/' + this.itemForm.id, this.itemForm)
          .then(res => {
            if (res) {
              this.dialog = false;
              this.$emit('getSuppliers')
              this.$setSuccess({text: this.$t('notify.update')});
            }
          })
          .catch(err => {
            this.$setFormError({error: err, obs: this.$refs['form']});
          })
          .finally(() => {
            this.loading = false;
          })
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