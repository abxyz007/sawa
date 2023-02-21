<template>
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <v-card-title>
        Create
      </v-card-title>
      <v-divider/>
      <validation-observer v-slot="{ handleSubmit }" ref="form">
        <form @submit.prevent="handleSubmit(save)">
          <v-card-text class="pb-0 pt-3">
            <v-row dense>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="'title'"
                    v-slot="{ errors }"
                    vid="title_ru"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.title_ru"
                      :label="'Title'"
                      outlined
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="'Status'"
                    v-slot="{ errors }"
                    vid="status"
                    rules="required"
                >
                  <v-select
                      :error-messages="errors[0]"
                      v-model="form.status"
                      :label="'Status'"
                      outlined
                      dense
                      :items="STATUS_KEYS"
                      item-text="text"
                      item-value="value"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    :name="'Order'"
                    v-slot="{ errors }"
                    vid="order"
                    rules="required|max:255"
                >
                  <v-text-field
                      type="number"
                      min="1"
                      :error-messages="errors[0]"
                      v-model="form.order"
                      :label="'Order'"
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
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <v-btn color="success" type="submit" :loading="loading">Save</v-btn>
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
  title_uz: null,
  title_ru: null,
  title_en: null,
  link: null,
  status: null,
  order: null,
  image: null,
}

export default {
  name: "CreateAndUpdateCarousel",
  data() {
    return {
      dialog: false,
      form: {...form},
      loading: false,
      image_url: null,
    }
  },
  methods: {
    removeImage() {
      this.image_url = null;
      this.form.image = null;
    },
    openDialog(item) {
      this.dialog = true;
      if(item) {
        this.form = getValueByKey(this.form, item);
        this.form.id = item.id;
        this.form.status = item.status
        this.image_url = item.image_url
        this.form.image = null
      }
    },
    async save() {
      this.loading = true;
      try {
        if(this.form.id) {
          const formData = this.getFormData('put');
          await this.$http.post(`carousel/${this.form.id}`, formData);
          this.$setSuccess({text: this.$t('notify.update')})
        } else {
          const formData = this.getFormData()
          await this.$http.post('carousel', formData);
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
    getFormData(method) {
      const formData = new FormData();
      formData.append('title_uz', this.form.title_uz);
      formData.append('title_ru', this.form.title_ru);
      formData.append('title_en', this.form.title_en);
      formData.append('link', this.form.link);
      formData.append('status', this.form.status);
      formData.append('order', this.form.order);
      if(this.form.image)
        formData.append('image', this.form.image);
      if(method) {
        formData.append('_method', method)
      }
      return formData
    }
  },
  watch: {
    dialog(val) {
      if(!val) {
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