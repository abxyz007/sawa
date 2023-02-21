<template>
  <v-card>
    <v-card-title class="headline">{{ $t('DoYouWantDelete') }}</v-card-title>
    <v-card-text>{{ $t('removeItemDialog') }}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')" color="red darken-1" text>{{ $t('cancel') }}</v-btn>
      <v-btn @click="$emit('deleteItem')" color="success darken-1" :loading="loading">{{ $t('delete') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DeleteDialog",
  props: {
    loading: Boolean
  }
}
</script>

<style scoped>

</style>
