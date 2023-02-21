<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title>
        Create
      </v-card-title>
      <v-divider/>
      <validation-observer v-slot="{ handleSubmit }" ref="form">
        <form @submit.prevent="handleSubmit(save)">
          <v-card-text class="pb-0 pt-3">
            <v-row dense>
              <v-col cols="12">
                <validation-provider
                    :name="'Document name'"
                    v-slot="{ errors }"
                    vid="name"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.name"
                      :label="'Document name'"
                      autofocus
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                    :name="$t('Document size')"
                    v-slot="{ errors }"
                    vid="name"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.size"
                      :label="'Document size'"
                      autofocus
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
  name: null,
  size: null,
}

export default {
  name: "RolesCreateUpdate",
  data() {
    return {
      dialog: false,
      form: {...form},
      test: null,
      loading: false,
    }
  },
  methods: {
    openDialog(item) {
      this.dialog = true;
      if (item) {
        this.form = getValueByKey(this.form, item);
        this.form.id = item.id;
      }
    },
    async save() {
      this.loading = true;
      try {
        if (this.form.id) {
          await this.$http.put(`roles/${this.form.id}`, this.form);
          this.$setSuccess({text: this.$t('notify.update')});
        } else {
          await this.$http.post('roles', this.form);
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
}
</script>

<style scoped>

</style>