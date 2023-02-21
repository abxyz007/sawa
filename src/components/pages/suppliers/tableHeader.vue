<template>
  <div>
    <v-row dense>
      <v-col
          cols="12"
          md="2"
      >
        <v-text-field
            :label="$t('searchName')"
            outlined
            dense
            v-model="filters.name"
            @input="startFilter"
            hide-details
        ></v-text-field>
      </v-col>
      <v-col
          cols="12"
          md="2"
      >
        <v-text-field
            :label="$t('searchInn')"
            outlined
            dense
            v-model="filters.tin"
            @input="startFilter"
            hide-details
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {debounce} from "../../../utils/helperFunction";

export default {
  name: "tableHeader",
  props: {
    filters: {
      type: Object
    }
  },
  data() {
    return {
      typeList: []
    }
  },
  methods:{
    startFilter: debounce(function () {
      this.$emit('getSuppliers');
    }, 300),
  }
}
</script>

<style scoped>

</style>