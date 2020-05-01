<template>
  <v-app class="animated zoomIn move ml-6 mr-6 pt-6">
    <v-row>
      <v-col md="4" class="d-flex flex-row">
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
  </v-app>
</template>

<script>
export default {
  name: 'MusicType',
  data() {
    return {
      keywords: '',
      menus: [],
      menuList: this.$store.state.menuList
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

    // this.menus = this.menuList[parent].subMenus[current].subMenus
  },
  methods: {}
}
</script>

<style scoped lang="scss"></style>
