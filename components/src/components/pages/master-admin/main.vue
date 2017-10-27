<template>
  <div>
    <header class="mainHeader">
      <div class="container">
        <h1>Hotel Booking</h1>
        <form action="#" id="search">
          <div class="control-group">
            <q-icon name="fa-search"></q-icon>
            <input type="text" class="input">
          </div>
        </form>
        <ul class="nav">
          <li>
            <router-link :to="{name: 'dashboard'}">
              <q-icon name="fa-tachometer"></q-icon>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'customer'}">
              <q-icon name="fa-users"></q-icon>
              <span>Khách hàng</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'hotel'}">
              <q-icon name="fa-bed"></q-icon>
              <span>Khách sạn</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'rss'}">
              <q-icon name="fa-rss"></q-icon>
              <span>Tin tức</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'userManagement'}">
              <q-icon name="fa-users"></q-icon>
              <span>Người dùng</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'layoutManagement'}">
              <q-icon name="fa-columns"></q-icon>
              <span>Giao diện</span>
            </router-link>
          </li>
        </ul>
      </div>
    </header>
    <router-view></router-view>
    <footer class="main-footer">
      &copy;copyright SPKT Team 2017 - Version 1.0.0
    </footer>
  </div>
</template>
<script>
import {QIcon} from 'quasar'
export default {
  components: {
    QIcon
  },
  data () {
    return {
    }
  },
  computed: {},
  created () {},
  mouted () {},
  beforeDestroy () {},
  methods: {}
}
</script>
<style lang="stylus" src="./master-admin.styl">
</style>
