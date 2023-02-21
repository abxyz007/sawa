<template>
  <v-app id="inspire">
    <v-main>
      <login />
    </v-main>
  </v-app>
</template>

<script>
import Login from "../pages/Login";
export default {
  name: "LoginLayout",
  components: {Login},
}
</script>

<style scoped>

</style>