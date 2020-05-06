<template>
  <div>
    <div>
      <mu-text-field
        v-model="keywords"
        placeholder="search"
        @blur.prevent="shows"
        style="margin:0 0px 0 20px"
      ></mu-text-field>
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
      <p style="margin:0 0px 0 20px">热门标签:</p>
      <mu-chip
        class="demo-chip"
        v-for="chip in chips"
        :key="chip.id"
        :color="chip.type"
        style="margin:0 20px 0 20px;"
        @click="chipsSearch(chip.name)"
        >{{ chip.name }}</mu-chip
      >
    </div>

    <div style="display:flex;padding: 20px 20px;width: 100%;height: 100%">
      <div class="s-l-table">
        <mu-data-table :columns="columns" :data="song" class="s-l-table-content">
          <template slot-scope="scope">
            <td class="is-left">{{ scope.row.songId }}</td>
            <td class="is-left">{{ scope.row.songName }}</td>
            <td class="is-left">{{ scope.row.singer }}</td>
            <td class="is-left">{{ scope.row.duration }}</td>
            <td class="is-left">{{ scope.row.createTime.slice(0, 10) }}</td>
            <td class="is-left">
              <button type="button" value="删除" style="width:80px;height:30px;background-color:red;">删除</button>
            </td>
          </template>
        </mu-data-table>
        <mu-flex justify-content="center" v-if="show">
          <!-- 每页显示的数量 -->
          <span style="margin-top: 10px">每页显示：</span>
          <mu-select style="width:70px" v-model="size" full-widt>
            <mu-option v-for="(option, index) in options" :key="index" :label="option" :value="option"></mu-option>
          </mu-select>
          <!-- 分页 -->
          <mu-pagination :total="totalPage" :current.sync="currentPage"></mu-pagination>
        </mu-flex>
      </div>
    </div>
  </div>
</template>

<script>
const initChips = [
  { id: 10, name: '薛之谦', type: 'secondary' },
  { id: 11, name: '邓紫棋', type: 'success' },
  { id: 12, name: '周深', type: 'info' },
  { id: 13, name: '林俊杰', type: 'warning' },
  { id: 14, name: '周杰伦', type: 'error' },
  { id: 15, name: '李荣浩', type: 'primary' }
]
export default {
  name: 'music',
  data() {
    return {
      chips: [...initChips],
      sort: {
        name: '',
        order: 'asc'
      },
      options: ['5', '10', '20', '50'],
      columns: [
        { title: 'id', width: 120, name: 'id', align: 'left' },
        { title: '歌名', name: 'name', width: 180, align: 'left' },
        { title: '歌手', name: 'singer', width: 150, align: 'left' },
        { title: '时常', name: 'duration', width: 150, align: 'left' },
        { title: '创建时间', name: 'create_time', width: 160, align: 'left' },
        { title: '操作', name: 'del_btn', width: 200, align: 'left' }
      ],
      song: [],
      buttonMenu: [],
      currentPage: 1,
      totalPage: 3042,
      size: 10,
      active: 0,
      keywords: '',
      show: true,
      menuList: this.$store.state.menuList,
      items: [],
      menus: [],
      id: ''
    }
  },
  components: {},
  created() {
    this.getSong()
    this.currentPage
    console.log(this.$options.name)
    this.$store.commit('setMenuList', JSON.parse(localStorage.getItem('menuList')))
    this.menuList = this.$store.state.menuList
    for (let i = 0; i < this.menuList.length; i++) {
      let parent = this.menuList[i]
      if (parent.subMenus.length !== undefined) {
        for (let j = 0; j < parent.subMenus.length; j++) {
          let child = this.menuList[i]
          if (child.subMenus[j].path === this.$options.name) {
            this.menus = child.subMenus[j].subMenus
            console.log(JSON.stringify(this.menus))
          }
        }
      }
    }
    // console.log('token的值' + this.token)
  },
  mounted() {},
  watch: {
    size: function() {
      this.getSong()
    },
    currentPage: function() {
      this.getSong()
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
      //模糊查询歌单
      alert('搜索歌曲')
      // let roleId = localStorage.getItem('roleId')
      // console.log(roleId)
      this.axios({
        method: 'get',
        url: this.GLOBAL.baseUrl + '/song/blur?',
        // 问号带参，表单提交
        params: {
          field: this.keywords
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.song = res.data.data
        this.show = false
      })
    },
    export() {
      alert('导出歌曲')
      this.axios.get(this.GLOBAL.baseUrl + '/song/export').then((res) => {
        if (res.data.code === 1) {
          alert('导出成功')
        }
      })
    },
    import() {
      alert('导入歌曲')
    },
    //获取歌曲
    getSong() {
      // let roleId = localStorage.getItem('roleId')
      // console.log(roleId)
      this.axios({
        method: 'get',
        url: this.GLOBAL.baseUrl + '/song/page?',
        params: {
          currentPage: this.currentPage,
          size: this.size
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.song = res.data.data
        this.getButtonMenu()
        console.log(this.song)
      })
    },
    chipsSearch(name) {
      this.keywords = name
      this.search()
    },
    shows() {
      if (this.keywords === '') this.show = true
      this.getSong()
    },
    //获取歌单中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus
        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌曲管理') {
              this.buttonMenu = menu[j].subMenus
            }
          }
        }
      }
    }
  },
  computed: {}
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
  height: 80%;
  &-content {
    height: 100%;
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
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 100%;
  display: flex;
}
.childTable {
  overflow: auto;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.scroll-hidden {
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
}
</style>
