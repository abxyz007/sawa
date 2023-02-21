let lastErrorMessage = null;


export default {
  methods: {
    $setFormError({error, obs}) {
      if(error && error.response && error.response.data && error.response.data.errors && obs) {
        obs.setErrors(error.response.data.errors)
      }
    },
    $setErrorFromServer({error}) {
      const text = error && error.response && error.response.data && error.response.data.message || error.message;
      if(text && lastErrorMessage !== text) {
        this.$store.dispatch('setSnackbar', {
          color: 'error',
          text: text
        })
        lastErrorMessage = text;
        setTimeout(() => {
          lastErrorMessage = null
        }, 1000)
      }
    },
    $setSuccess({ text }) {
      this.$store.dispatch('setSnackbar', {
        color: 'success',
        text: text
      })
    },
    $showLoading() {
      this.$store.commit('setLoading', true);
    },
    $clearLoading() {
      this.$store.commit('setLoading', false);
    }
  }
}