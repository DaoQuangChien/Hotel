<template>
  <div>
    <md-toolbar class="md-medium">
      <div class="md-toolbar-container container">
        <img class="logo" src="/statics/bookme1_1x.png" />
        <h1 class="md-title" style="flex: 1"></h1>
        <div class="navs">
          <div class="nav">
            <router-link :to="{name: 'index'}">{{$t('nav.link.home')}}</router-link>
          </div>
          <div class="nav">
            <router-link :to="{name: 'hotels'}">{{$t('nav.link.hotel')}}</router-link>
          </div>
          <div class="nav">
            <router-link :to="{name: 'blogs'}">{{$t('nav.link.blogs')}}</router-link>
          </div>
          <div class="nav">
            <router-link :to="{name: 'feedback'}">{{$t('nav.link.feedback')}}</router-link>
          </div>
          <div class="nav">
            <router-link :to="{name: 'about'}">{{$t('nav.link.about')}}</router-link>
          </div>
        </div>
      </div>
    </md-toolbar>
    <router-view></router-view>
    <footer>
      &copy;copyright SPKT Team 2017 - Version 1.0.0
    </footer>
  </div>
</template>
<script>
export default {
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
<style lang="stylus" src="./master.styl">
</style>
