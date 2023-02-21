<template>
  <div class="login_page">
    <div class="login_form__block">
      <div class="login_page_text">
        <p
            class="mb-0"
        >{{ $t('loginPassword') }}</p>
      </div>
      <ValidationObserver
          ref="form"
          v-slot="{handleSubmit}"
      >
        <v-form @submit.prevent="handleSubmit(login)">
          <v-card-text class="hls_login_forms pb-0 px-2">
            <validation-provider
                rules="required"
                :name="$t('login')"
                vid="username"
                v-slot="props"
            >
              <v-text-field
                  :placeholder="$t('login')"
                  s type="text"
                  autocomplete="nope"

                  v-model="form.username"
                  :error-messages="props.errors[0]"
              ></v-text-field>
            </validation-provider>

            <validation-provider
                rules="required|min:8|max:255"
                :name="$t('password')"
                vid="password"
                v-slot="props"
            >
              <v-text-field
                  :placeholder="$t('password')"
                  class="pt-0"
                  type="password"
                  autocomplete="new-password"
                  v-model="form.password"
                  :error-messages="props.errors[0]"
              ></v-text-field>
            </validation-provider>
          </v-card-text>
          <v-card-actions>
            <v-btn
                class="login_form_submit mt-3"
                width="100%"
                height="50"
                color="#37474F"
                dark
                type="submit"
                outlined
                :loading="loading"
            >{{ $t('sign') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </div>
    <div class="login_background_image"></div>
  </div>
</template>

<script>
import TokenService from "../utils/TokenService";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      loading: false,
    }
  },
  mounted() {
    if (TokenService.getLogin())
      this.$router.push('/slider');
  },
  methods: {
    async login() {
      let valid = await this.$refs.form.validate();
      if (valid) {
        this.loading = true;
        this.$http.post('auth/login', this.form)
            .then(res => {
              if (res.data.success) {
                TokenService.saveToken(res.data.data.access_token);
                TokenService.setRoles(res.data.data.role);
                TokenService.setPermissions(res.data.data.permissions);
                TokenService.setExpireTime(res.data.data.expires_in);
                this.me();
              }
            })
            .catch(err => {
              this.$setFormError({error: err, obs: this.$refs['form']});
              this.$setErrorFromServer({error: err});
            })
            .finally(() => {
              this.loading = false;
            })
      }
    },
    me() {
      this.$http.post('auth/me')
          .then(res => {
            if (res.data.success) {
              TokenService.setUserName(res.data.data.username);
              this.$store.dispatch('setUser', {
                name: res.data.data.name,
                email: res.data.data.email,
              });
              this.$router.push('/slider');

              this.$setSuccess({text: this.$t('welcome')});
            }
          })
          .catch(err => {
           this.$setErrorFromServer({error: err});
          })
    }
  }
}
</script>


<style lang="scss">
.login_page {
  min-height: 100vh;
  background: #fffafa;
}

.login_form__block {
  position: absolute;
  width: 550px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  box-shadow: 0 0 15px 5px lightgray;
  background: white;

  .v-input__slot {
    border-color: red !important;
  }

  .login_page_text {
    font-family: 'Rajdhani Light', sans-serif;
    font-weight: 500;
    font-size: 28px;
    color: #6c6c6c;
  }
}
</style>

