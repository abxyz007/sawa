<template>
  <v-app id="inspire">
    <v-navigation-drawer
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
    >
      <left-side-bar />
    </v-navigation-drawer>


    <v-app-bar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        color="#fff"
        class="main-bg-color elevation-1"
    >
      <v-app-bar-nav-icon style="color: #2264BF" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div>
        <v-menu
            offset-y
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
                outlined
                class="ma-5"
                v-bind="attrs"
                v-on="on"
                text
            >
              {{ language }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item
                v-for="(item, index) in languages"
                :key="`language${index}`"
                link
                @click="changeLanguage(item)"
            >
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div>
            <v-btn
                v-if="user"
                text
                v-bind="attrs"
                v-on="on"
                style="color: #7a7878 !important;"
                class="d-flex align-center justify-space-between"
            >
              <h4 class="ml-1" >
                <v-icon left>mdi-account</v-icon>
                {{ user.username }}
              </h4>
            </v-btn>
          </div>
        </template>
        <v-list>
          <v-list-item
              link
          >
            <v-list-item-title @click="logout">
              <v-icon color="red">mdi-logout</v-icon>
              {{ $t('logout') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>
    <v-main>
      <div class="px-4 py-10 mb-5">
        <router-view/>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import TokenService from '../utils/TokenService'
import {mapActions, mapState} from 'vuex'
import LeftSideBar from "./LeftSideBar";

export default {
  name: "MainLayout",
  components: {LeftSideBar},
  data: () => ({
    selectedItem: 1,
    dialog: false,
    drawer: null,
    items: [],
    language: 'RU',
    languages: [
      {name: 'UZ', id: 'uz'},
      {name: 'RU', id: 'ru'},
    ],
  }),
  created() {
    this.createMenu();
    if (!this.user) {
      this.setUser();
    }
    this.getLanguage();
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    getLanguage() {
      const lang = localStorage.getItem('lang');
      if (lang) {
        this.languages.forEach(p => {
          if (p.id === lang) {
            this.language = p.name;
          }
        })
      } else {
        localStorage.setItem('lang', 'ru');
      }
    },
    changeLanguage(item) {
      document.location.reload();
      localStorage.setItem('lang', item.id);
      this.language = item.name;
      this.$i18n.locale = item.id;
    },
    ...mapActions(['setUser']),
    createMenu() {
      this.items = this.menus
    },
    logout() {
      this.$http.post('auth/logout')
          .then(res => {
            if (res) {
              TokenService.removePermissions();
              TokenService.removeToken();
              TokenService.removeUserName();
              this.$router.push('/login');
              this.$setSuccess({text: this.$t('YouLoggedOut')});
            }
          })
          .catch(err => {
            this.$setErrorFromServer({error: err});
          })
    },
  },
}
</script>

<style lang="scss">

.child {
  padding-left: 40px;
  position: relative;
}

.toolbar-title {
  display: flex;
  align-items: center;

  &__text {
    font-size: 13px;
    font-weight: bold;
    margin-left: 10px;
    max-width: 240px;
  }
}

.toolbar-site {
  white-space: normal !important;
  text-overflow: clip  !important;
  width: 400px;
}
</style>
