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
                    :name="$t('receiver')"
                    v-slot="{ errors }"
                    vid="receiver_id"
                    rules="required"
                >
                  <v-autocomplete
                      :error-messages="errors[0]"
                      v-model="form.receiver_id"
                      :label="$t('receiver')"
                      outlined
                      dense
                      clearable
                      :items="userList"
                      item-text="name"
                      item-value="id"
                  ></v-autocomplete>
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
                <validation-provider
                    :name="$t('theme')"
                    v-slot="{ errors }"
                    vid="theme"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.theme"
                      :label="$t('theme')"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <div>
                  <v-file-input
                      v-if="!icon_url && !iconName"
                      v-model="form.file"
                      :label="$t('file')"
                      outlined
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

              <v-col cols="12">
                <validation-provider
                    :name="$t('text ')"
                    v-slot="{ errors }"
                    vid="text"
                    rules="required"
                >
                  <v-textarea
                      :error-messages="errors[0]"
                      v-model="form.text"
                      :label="$t('text')"
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
import {STATUS} from "../../../utils/constants";
import {getValueByKey} from "../../../utils/helperFunction";

const form = {
  receiver_id: null,
  text: null,
  theme: null,
  status: null,
  file: null
}

export default {
  name: "MessageCreateUpdate",
  data() {
    return {
      dialog: false,
      form: {...form},
      test: null,
      loading: false,
      image_url: null,
      icon_url: null,
      iconName: null,
      userList: []
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    openDialog(item) {
      this.dialog = true;
      if (item) {
        this.form = getValueByKey(this.form, item);
        this.form.id = item.id;
        this.form.status = item.status;
        this.iconName = item.file;
      }
    },
    async save() {
      this.loading = true;
      const formData = this.getFormData();
      try {
        await this.$http.post('/messages/send', formData);
        this.$setSuccess({text: this.$t('notify.save')});
        this.$emit('getData');
        this.dialog = false;
      } catch (err) {
        this.$setFormError({error: err, obs: this.$refs['form']});
        this.$setErrorFromServer({error: err});
      } finally {
        this.loading = false;
      }
    },
    async getUserList() {
      try {
        let {data: {data}} = await this.$http.get('messages/user-list');
        this.userList = data.map(p => {
          p.name = p.name + ` (${p.type})`;
          return p
        })
      } catch (err) {
        this.$setErrorFromServer({error: err});
      }
    },
    removeUpdateIcon() {
      this.form.icon = null;
      this.iconName = null;
      this.icon_url = null;
    },
    removeImage() {
      this.icon_url = null;
      this.form.icon = null;
      this.iconName = null
    },
    getFormData() {
      const formData = new FormData();
      if(this.form.file)
        formData.append('file', this.form.file);
      formData.append('receiver_id', this.form.receiver_id);
      formData.append('text', this.form.text);
      formData.append('status', this.form.status);
      formData.append('theme', this.form.theme);
      return formData
    }
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
      let status = [];
      Object.keys(STATUS).forEach(p => {
        status.push({value: +p, text: this.$t(`statusList.${STATUS[p]}`)});
      })
      return status;
    }
  }
}
</script>

<style scoped>

</style>