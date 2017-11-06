<template>
  <main class="hotel-container">
    <div class="left-side">
      <ul class="menu">
        <li class="menu-item">
          <router-link :to="{name: 'hotel-summary', params: {hotelID: 123}}">
            <span class="menu-icon fa fa-home"></span>
            <span class="menu-title">Thông tin chung</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link :to="{name: 'hotel-room'}">
            <span class="menu-icon fa fa-bed"></span>
            <span class="menu-title">Thông tin phòng</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link :to="{name: 'hotel-event'}">
            <span class="menu-icon fa fa-calendar"></span>
            <span class="menu-title">Khuyễn mãi</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link :to="{name: 'hotel-price'}">
            <span class="menu-icon fa fa-usd"></span>
            <span class="menu-title">Thời giá</span>
          </router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
    <div class="clearfix"></div>
  </main>
</template>
<style lang="stylus">
  @import '~src/themes/quasar.variables.styl'
  main.hotel-container
    padding 0
  .left-side
    height: calc(100vh - 123px)
    float: left
    padding: 0
    .menu
      list-style none
    .menu, .menu-item
      padding: 0
      margin 0
    .menu-item
      &.active
        .menu-icon, .menu-title
          color: $primary
      a
        display: block
        padding: 15px 5px
        &:hover, &.router-link-exact-active
          .menu-icon, .menu-title
            color $primary
    .menu-icon
      display: inline-block
      width: 16px
    .menu-icon, .menu-title
      padding: 0px
      margin: 0px 5px
      color: $dark
    @media (max-width: $screen-xs-max)
      .menu-title
        display: none
  .content-side
    color $dark
    padding-top 15px
    h2
      padding-left 15px
  .hotel-form
    padding 15px
  .clearfix:after
    display table
    content ''
    clear both
@media (min-width: $screen-sm-min)
  .left-side
    width: 160px
  .content-side
    margin-left: 160px
    padding-left: 0px
    border-left: 1px solid $light
@media (max-width: $screen-xs-max)
  .left-side
    width: 36px
  .content-side
    margin-left: 36px
    padding-left: 0px
    border-left: 1px solid $light
</style>

