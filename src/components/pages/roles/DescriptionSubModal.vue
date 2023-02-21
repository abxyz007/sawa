<template>
  <v-dialog v-model="dialog" width="500">
      <v-card>
      <validation-observer v-slot="{ handleSubmit }" ref="form">
        <form @submit.prevent="handleSubmit(save)">
          <v-card-title>
            {{ $t('update') + ' ' + $t('description') }}
          </v-card-title>
          <v-divider />
          <v-card-text class="pb-0 pt-3">
            <v-row dense>
              <v-col>
                <validation-provider
                  vid="description_uz"
                  :name="$t('description_uz')"
                  rules="required|max:1000"
                  v-slot="{ errors }"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.description_uz"
                      outlined
                      dense
                      :label="$t('description_uz')"
                  />
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider
                    vid="description_ru"
                    :name="$t('description_ru')"
                    rules="required|max:1000"
                    v-slot="{ errors }"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.description_ru"
                      outlined
                      dense
                      :label="$t('description_ru')"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
                text
                small
                @click="dialog = false"
            >{{ $t('cancel') }}</v-btn>
            <v-btn
                color="success"
                small
                type="submit"
                :loading="loading"
            >{{ $t('save') }}</v-btn>
          </v-card-actions>
        </form>
      </validation-observer>
      </v-card>
  </v-dialog>
</template>

<script>
import {getValueByKey} from "../../../utils/helperFunction";

export default {
  name: "DescriptionSubModal",
  data() {
    return {
      form: {
        description_ru: '',
        description_uz: ''
      },
      id: null,
      dialog: false,
      loading: false,
      changeName: null,
    }
  },
  methods: {
    openDialog(val, name) {
      this.dialog = true;
      if(val) {
        this.form = getValueByKey(this.form, val);
        this.id = val.id;
      }
      if(name) {
        this.changeName = name;
      }
    },
    save() {
      this.loading = true;
      this.$http.put(`/roles/update-permission/${this.id}`, this.form)
      .then(res => {
        this.$setSuccess({text: this.$t('notify.update')});
        this.dialog = false;
        this.$emit('changeDescription', res.data.data, this.changeName);
      })
      .catch(err => {
        this.$setErrorFromServer({error: err})
      })
      .finally(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style scoped>
.sub-modal {
  background: white;
  position: absolute;
  width: 300px;
}

.sub-modal-enter-active, .sub-modal-leave-active {
  transition: opacity .5s;
}

.sub-modal-enter, .sub-modal-leave-to {
  opacity: 0;
}
</style>