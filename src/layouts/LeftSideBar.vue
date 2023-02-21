<template>
  <div>
    <v-list dense class="pb-0">
      <template>
        <v-card
            class="mx-auto elevation-0"
            max-width="300"
            tile
        >
          <v-list>
            <v-list-item-group
                v-model="selectedItem"
                color="primary"
            >
              <div
                  v-for="(item, i) in menus"
                  :key="i"
              >
                <v-list-item
                    v-if="item.permissions"
                    link
                    :to="item.to"
                    @click="clearActiveChildMenu"
                >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list-item-group>
          </v-list>
          <v-list class="pt-0">
            <div
                v-for="(item, index) in childMenu"
                :key="item.title"
            >
              <v-list-group
                  v-model="item.active"
                  :prepend-icon="item.action"
                  v-if="item.permissions"
              >
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </template>
                <div
                    v-for="child in item.items"
                    :key="child.title"
                >
                  <v-list-item
                      v-if="child.permissions"
                      class="pl-8"
                      link
                      :to="child.to"
                      @click="activeChildMenu(child, index)"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="child.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="child.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list-group>
            </div>
          </v-list>
        </v-card>
      </template>
    </v-list>
  </div>
</template>

<script>
import can from "../mixins/can";

export default {
  name: "LeftSideBar",
  data() {
    return {
      selectedItem: 1,
      childMenu: [],
      notChild: 'notChild',
      activeMenu: 'ACTIVE_MENU'
    }
  },
  created() {
    this.checkPermission();
    this.checkActiveChild();
  },
  methods: {
    clearActiveChildMenu() {
      localStorage.setItem(this.activeMenu, this.notChild)
    },
    activeChildMenu(val, index) {
      setTimeout(() => {
        if(val.to === this.$route.path) {
          localStorage.setItem(this.activeMenu, index+1)
        }
      },100)
    },
    checkActiveChild() {
      const chek = localStorage.getItem(this.activeMenu);
      if(chek && chek !== this.notChild) {
        this.childMenu[+chek-1].active = true;
      }
    },
    checkPermission() {
     setTimeout(() => {
       let count = 0;
       this.childMenu.map(p => {
         p.items.forEach(b => {
           if(b.permissions) {
             count++
           }
         })
         if(count < 1) {
           p.permissions = false
         }
         if(count > 0) {
           p.permissions = true
         }
       })
     }, 100)
    },
  },
  computed: {
    menus() {
      return [
        {icon: 'mdi-view-carousel', text: this.$t('slider'), to: '/slider', permissions: can('carousel index')},
        {icon: 'mdi-arrow-horizontal-lock', text: this.$t('role'), to: '/role', permissions: can('roles index')},
        {icon: 'mdi-page-layout-body', text: this.$t('pages'), to: '/pages', permissions: can('pages index')},
      ]
    },
  }
}
</script>

<style scoped>

</style>