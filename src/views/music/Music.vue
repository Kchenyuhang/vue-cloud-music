<template>
  <v-container class="animated lightSpeedIn move ml-6 mr-6 pt-6">
    <v-row>
      <v-col md="6" class="d-flex flex-row">
        <v-text-field v-model="keywords" :counter="10" label="keywords" required></v-text-field>
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
  </v-container>
</template>

<script>
export default {
  name: 'Music',
  data() {
    return {
      menuList: this.$store.state.menuList,
      items: [],
      keywords: ''
    }
  },
  created() {
    console.log(this.$options.name)
    for (let i = 0; i < this.menuList.length; i++) {
      let parent = this.menuList[i]
      for (let j = 0; j < parent.subMenus.length; j++) {
        let child = this.menuList[i]
        if (child.subMenus[j].path === this.$options.name) {
          this.menus = child.subMenus[j].subMenus
          console.log(JSON.stringify(this.menus))
        }
      }
    }
  },
  methods: {
    handleClick(title) {
      if (title === '新增') {
        this.add()
      }
      if (title === '搜索') {
        this.search()
      }
      if (title === '导入') {
        this.import()
      }
      if (title === '导出') {
        this.export()
      }
    },
    add() {
      alert('新增歌曲')
    },
    search() {
      alert('搜索歌曲')
    },
    export() {
      alert('导出歌曲')
    },
    import() {
      alert('导入歌曲')
    }
  }
}
</script>

<style scoped lang="scss"></style>
