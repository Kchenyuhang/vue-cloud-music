<template>
  <v-app class="animated zoomIn move ml-6 mr-6 pt-6">
    <v-row>
      <v-col md="6" class="d-flex flex-row">
        <v-text-field
          v-model="keywords"
          :counter="10"
          label="keywords"
          oninput="search(event)"
          onporpertychange="search(event)"
          required
        ></v-text-field>
        <v-btn
          v-for="(item, index) in menus"
          :key="index"
          :color="item.icon"
          class="mr-3"
          @click="handleClick(item.title)"
          large
        >
          {{ item.title }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <template v-for="(item, index) in songList">
        <v-col :key="index" cols="12" md="3">
          <v-hover v-slot:default="{ hover }">
            <v-card class="mx-auto" color="grey lighten-4" min-height="280" link>
              <v-img :aspect-ratio="16 / 9" :src="item.thumbnail">
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                    style="height: 100%;"
                  ></div>
                </v-expand-transition>
              </v-img>
              <v-card-text class="pt-6" style="position: relative;">
                <v-btn absolute color="pink" class="white--text" fab dark right top>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <div class="font-weight-light  mb-2 mt-3">
                  {{ item.songListName }}
                </div>
                <div class="font-weight-light grey--text mb-2 mt-3">
                  <span class="mr-2">{{ item.songCount }}播放</span>
                  <span>{{ item.likeCount }}收藏</span>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: 'music-list',
  data() {
    return {
      menuList: this.$store.state.menuList,
      admin: this.$store.state.admin,
      menus: [],
      items: [],
      keywords: ''
    }
  },
  created() {
    // alert(this.$options.name)
    this.$store.commit('setMenuList', JSON.parse(localStorage.getItem('menuList')))
    this.menuList = this.$store.state.menuList
    console.log(this.menuList)
    for (let i = 0; i < this.menuList.length; i++) {
      let parent = this.menuList[i]
      if (parent.subMenus !== undefined) {
        for (let j = 0; j < parent.subMenus.length; j++) {
          let child = this.menuList[i]
          if (child.subMenus[j].path === this.$options.name) {
            this.menus = child.subMenus[j].subMenus
          }
        }
      }
    }
    console.log(this.menus)
    this.axios.get('/songList/all').then((res) => {
      this.items = res.data.data
    })
  },
  methods: {
    handleClick(title) {
      if (title === '查询') {
        this.search()
      }
      if (title === '导出') {
        this.export()
      }
      if (title === '删除') {
        this.delete()
      }
    },
    export() {
      this.axios.get(this.GLOBAL.baseUrl + '/songList/export').then((res) => {
        if (res.data.code === 1) {
          alert('导出成功')
        }
      })
    },
    search() {
      // if (this.keywords.length != 0) {
      //   this.items = this.items.filter((item) => item.songListName.indexOf(this.keywords) >= 0)
      // }
    }
  },
  computed: {
    songList() {
      return this.items.filter((item) => item.songListName.indexOf(this.keywords) >= 0)
    }
  }
}
</script>

<style scoped lang="scss">
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
