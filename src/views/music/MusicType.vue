<template>
  <v-app class="animated zoomIn move ml-6 mr-6 pt-6">
    <div style="width: 100%">
      <!-- 下边类型表格 -->
      <div class="s-l-tab" style="margin-top: 20px">
        <div>
          <!-- tab标签头 -->
          <mu-tabs :value.sync="active" class="tabs">
            <mu-tab v-for="(type, index1) in types" :key="index1">{{ type.type }}</mu-tab>
          </mu-tabs>
        </div>
        <div>
          <div class="demo-text" v-for="(type, index2) in types" :key="index2" style=" overflow: hidden">
            <!-- 定义表头信息 -->
            <mu-data-table :columns="columns" :data="type.child" class="childTable" v-if="active == index2">
              <!-- 定义表格内的数据 -->
              <template slot-scope="scope">
                <td class="is-left">{{ scope.row.song_list_id }}</td>
                <td class="is-left">{{ scope.row.song_list_name }}</td>
                <td class="is-right">{{ scope.row.song_count }}</td>
                <td class="is-right">{{ scope.row.create_time.slice(0, 10) }}</td>
              </template>
            </mu-data-table>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'MusicList',
  data() {
    return {
      sort: {
        name: '',
        order: 'asc'
      },
      options: ['5', '10', '15'],
      columns: [
        { title: 'id', width: 150, name: 'name', align: 'center' },
        { title: '名称', name: 'calories', width: 270, align: 'left', sortable: true },
        { title: '歌曲数', name: 'protein', width: 100, align: 'right', sortable: true },
        { title: '创建时间', name: 'create_time', width: 190, align: 'right', sortable: true }
      ],
      songList: [],
      buttonMenu: [],
      currentPage: 1,
      totalPage: 1000,
      size: 10,
      page: 1,
      active: 0,
      types: [],
      typeChildSongList: [],
      keywords: '',
      start: 0,
      end: 10
    }
  },
  components: {},
  created() {
    this.getSongList()
  },
  mounted() {},
  watch: {
    // 侦听器，监听当前页的数量与当前页值的变化
    size: function(newSize, oldSize) {
      this.totalPage = (1000 / this.size) * 10
      //新值与旧值进行对比
      if (newSize > oldSize) {
        this.end = this.end + (newSize - oldSize)
      } else {
        this.end = this.end - (oldSize - newSize)
      }
    },
    currentPage: function(newCurrent, oldCurrent) {
      if (newCurrent == 1000 / this.size) {
        this.page += 1
      }
      if (newCurrent < oldCurrent && newCurrent >= 0) {
        this.start -= 10
        this.end -= 10
      } else {
        this.start += 10
        this.end += 10
      }
    }
  },
  methods: {
    //获取歌单
    getSongList() {
      this.axios({
        method: 'GET',
        url: this.GLOBAL.baseUrl + '/songList/page',
        params: {
          currentPage: this.page,
          size: 3042
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.songList = res.data.data
        this.getButtonMenu()
        this.getSongListType()
        console.log(this.songList)
      })
    },
    getSongListType() {
      this.axios({
        method: 'GET',
        url: this.GLOBAL.baseUrl + '/songList/type',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        //获取各种类型及属于该类型的歌单数据
        this.types = res.data.data
        console.log(this.types)
        //取出第一种类型的所有歌单，作为默认tab页上显示的数据
        this.typeChildSongList = this.types[0].child
        console.log(this.typeChildSongList)
      })
    },
    //获取歌单中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus
        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌单管理') {
              this.buttonMenu = menu[j].subMenus
            }
          }
        }
      }
    },
    //排序
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) => (order === 'asc' ? a[name] - b[name] : b[name] - a[name]))
    }
  }
}
</script>

<style scoped lang="scss">
.table {
  background-color: white;
  color: black;
}
.content {
  flex: 0 0 33%;
}
.btn {
  margin: 20px 20px;
}
.s-l-table {
  width: 100%;
  background-color: white;
  margin-right: 60px;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  &-content {
    height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 10px;
  }
}
.tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 120px;
  overflow-y: auto;
}
.s-l-tab {
  background-color: white;
  width: 875px;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  display: flex;
}
.childTable {
  overflow: auto;
  width: 750px;
  height: 500px;
}
</style>
