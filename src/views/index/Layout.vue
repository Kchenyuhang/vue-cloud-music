<template>
  <v-app>
    <v-card class="overflow-hidden">
      <v-app-bar
        fixed
        style="top:0;left:0;"
        color="cyan darken-4"
        dark
        src="https://niit-soft.oss-cn-hangzhou.aliyuncs.com/wallpaper/18.jpg"
        height="120px"
        app
      >
        <template v-slot:img="{ props }">
          <v-img v-bind="props" gradient="to top right, rgba(55,71,79,.5), rgba(128,208,199,.8)"></v-img>
        </template>
        <v-app-bar-nav-icon @click.stop="mini = !mini"></v-app-bar-nav-icon>
        <v-toolbar-title>云音乐后台</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-menu left bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>系统设置</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>主题设置</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout()">
              <v-list-item-title>退出系统</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </v-card>

    <v-content>
      <v-card class="overflow-hidden">
        <v-navigation-drawer
          fixed
          style="left:2px;top:130px"
          class="blue-grey darken-3"
          v-model="drawer"
          :mini-variant.sync="mini"
          permanent
          dark
          app
          fluid
        >
          <v-card class="mx-auto gradient-bg">
            <v-toolbar class="gradient-bg">
              <router-link to="/profile">
                <v-list-item-avatar>
                  <img :src="admin.avatar" />
                </v-list-item-avatar>
              </router-link>
              <router-link to="/profile">
                <v-toolbar-title class="link">{{ admin.name }}</v-toolbar-title>
              </router-link>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-list>
              <v-list-group v-for="(menu, parent) in menuList" :key="parent" v-model="menu.active" no-action>
                <template v-slot:activator v-ripple>
                  <v-list-item-icon>
                    <v-icon>{{ menu.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content v-if="menu.subMenus.length === 0">
                    <router-link :to="menu.path" v-if="menu.subMenus.length === 0">
                      <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
                    </router-link>
                  </v-list-item-content>
                  <v-list-item-content v-else>
                    <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item v-for="(subMenu, current) in menu.subMenus" :key="current" v-ripple link>
                  <v-list-item-icon>
                    <v-icon>{{ subMenu.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <router-link :to="{ name: subMenu.path, params: { parent: parent, current: current } }">
                      <v-list-item-title class="link">{{ subMenu.title }}</v-list-item-title>
                    </router-link>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-card>
        </v-navigation-drawer>
      </v-card>
      <router-view>
        <v-card class="overflow-hidden" style="margin-top:200px;">
          <v-app-bar absolute color="primary" dark inverted-scroll scroll-target="#scrolling-techniques-8">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>Title</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-app-bar>
          <v-sheet id="scrolling-techniques-8" class="overflow-y-auto" max-height="600">
            <v-container style="height: 1500px;"> </v-container>
          </v-sheet>
        </v-card>
      </router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      parent: 0,
      current: 0,
      admin: this.$store.state.admin,
      menuList: [],
      drawer: true,
      mini: false
    }
  },
  created() {
    this.axios.get(this.GLOBAL.baseUrl + '/sysRole?roleId=' + localStorage.getItem('roleId')).then((res) => {
      this.menuList = res.data.data.menus
      localStorage.setItem('menuList', JSON.stringify(res.data.data.menus))
      this.$store.commit('setMenuList', JSON.stringify(res.data.data.menus))
    })
  },
  mounted() {},
  methods: {
    logout() {
      alert('log out')
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      localStorage.removeItem('roleId')
      localStorage.removeItem('menuList')
      this.$router.push('/login')
    },
    gotoSubPage(path, index, index1) {
      console.log(path, index, index1)
      this.$router.push({
        path: path,
        query: {
          index: index,
          index1: index1
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.gradient-bg {
  background-image: linear-gradient(to bottom, rgba(55, 71, 79, 0.5), rgba(128, 208, 199, 0.8));
}
</style>
