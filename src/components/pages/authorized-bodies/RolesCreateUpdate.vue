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
                    :name="$t('username')"
                    v-slot="{ errors }"
                    vid="username"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.username"
                      :label="$t('username')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('password')"
                    v-slot="{ errors }"
                    vid="password"
                    :rules="{required: !form.id} && 'max:255'"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="password"
                      :label="$t('password')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('full_name')"
                    v-slot="{ errors }"
                    vid="full_name"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.full_name"
                      :label="$t('full_name')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('tin')"
                    v-slot="{ errors }"
                    vid="tin"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.tin"
                      :label="$t('tin')"
                      v-mask="'#########'"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('passport_serial')"
                    v-slot="{ errors }"
                    vid="passport_serial"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.passport_serial"
                      :label="$t('passport_serial')"
                      v-mask="'AA'"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('passport_number')"
                    v-slot="{ errors }"
                    vid="passport_number"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.passport_number"
                      :label="$t('passport_number')"
                      v-mask="'#######'"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('email')"
                    v-slot="{ errors }"
                    vid="email"
                    rules="required|email"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.email"
                      :label="$t('email')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('workplace')"
                    v-slot="{ errors }"
                    vid="work"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.work"
                      :label="$t('workplace')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="$t('position')"
                    v-slot="{ errors }"
                    vid="position"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.position"
                      :label="$t('position')"
                      outlined
                      dense
                  />
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

const form = {
  username: null,
  full_name: null,
  tin: null,
  passport_serial: null,
  passport_number: null,
  email: null,
  work: null,
  position: null
}

export default {
  name: "RolesCreateUpdate",
  data() {
    return {
      dialog: false,
      form: {...form},
      test: null,
      loading: false,
      password: null,
    }
  },
  methods: {
    openDialog(item) {
      this.dialog = true;
      if (item) {
        this.form = getValueByKey(this.form, item);
        this.form.id = item.id;
        this.form.user_id = item.user_id
      }
    },
    async save() {
      if(this.password) {
       this.form.password = this.password;
      }
      this.loading = true;
      try {
        if (this.form.id) {
          await this.$http.put(`administrators/mfi/update/${this.form.id}`, this.form);
          this.$setSuccess({text: this.$t('notify.update')});
        } else {
          await this.$http.post('administrators/mfi/create', this.form);
          this.$setSuccess({text: this.$t('notify.save')});
        }
        this.dialog = false;
        this.$emit('getItems');
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
}
</script>

<style scoped>

</style>