<template>
  <v-card max-width="400" class="mx-auto">
    <v-container class="pa-1">
      <span v-for="(item, index) in menus" :key="index" class="gutter">
        <mu-button :color="item.icon">{{ item.title }}</mu-button>
      </span>
      <v-item-group v-model="selected" multiple>
        <v-row>
          <v-col v-for="(item, i) in items" :key="i" cols="12" md="6">
            <v-item v-slot:default="{ active, toggle }">
              <v-img
                :src="`https://cdn.vuetifyjs.com/images/${item.src}`"
                height="150"
                class="text-right pa-2"
                @click="toggle"
              >
                <v-btn icon dark>
                  <v-icon>
                    {{ active ? 'mdi-heart' : 'mdi-heart-outline' }}
                  </v-icon>
                </v-btn>
              </v-img>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'MusicList',
  data() {
    return {
      items: [
        {
          src: 'backgrounds/bg.jpg'
        },
        {
          src: 'backgrounds/md.jpg'
        },
        {
          src: 'backgrounds/bg-2.jpg'
        },
        {
          src: 'backgrounds/md2.jpg'
        }
      ],
      menus: []
    }
  },
  created() {
    let index = this.$route.query.index
    let index1 = this.$route.query.index1
    this.menus = JSON.parse(localStorage.getItem('menuList'))[index].subMenus[index1].subMenus
  }
}
</script>

<style scoped lang="scss"></style>
