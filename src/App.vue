<template>
  <v-app id="app">

    <router-view/>
    <v-snackbar
        v-model="snackbar.showing"
        :timeout="snackbar.time"
        :color="snackbar.color"
    >
      {{ snackbar.text }}
      <v-btn text @click="snackbar.showing = false">{{ snackbar.btn }}</v-btn>
    </v-snackbar>

    <transition name="loading">
      <loader v-if="$store.getters.loading"/>
    </transition>
  </v-app>
</template>

<script>
import {mapState} from 'vuex';
import Loader from "./components/ui/loader/Loader";

export default {
  name: 'App',
  components: {Loader},
  data: () => ({
    //
  }),
  created() {
  },
  computed: {
    ...mapState(['snackbar'])
  }
};
</script>

<style scoped>
.loading-enter-active, .loading-leave-active {
  transition: opacity .5s;
  z-index: 400;
}

.loading-enter, .loading-leave-to {
  opacity: 0;
  z-index: 400;
}

.transition-loading {
  position: relative;
  z-index: 400;
}
</style>