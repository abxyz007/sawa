<template>
  <div class="text-center mt-3">
    <v-pagination
        v-if="lastPage > 1"
        :length="lastPage"
        v-model="params.page"
        @input="changePage"
        total-visible="7"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    params: {
      type: Object,
      default: () => {
        return {
          page: 1,
        }
      }
    },
    lastPage: {
      type: Number,
      default: 1
    }
  },
  methods: {
    changePage(val) {
      this.$emit('getSuppliers', val)
    }
  }
}
</script>

<style scoped>

</style>