<template>
  <div class="mb-3">
    <v-btn dark small color="primary" @click="$router.go(-1)">
      <v-icon left small>mdi-arrow-left</v-icon>
      {{ $t('back') }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "BackRouter"
}
</script>

<style scoped>

</style>