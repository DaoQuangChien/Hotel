<template>
  <md-layout :gutter="8" class="filter-box">
    <md-input-container :class="layout">
      <label>Tỉnh-Thành Phố</label>
      <md-select v-model="criteria.city">
        <md-option key="index" v-for="city,index in cities" :value="city">{{city}}</md-option>
      </md-select>
    </md-input-container>
    <md-input-container :class="layout">
      <label>Khách sạn</label>
      <md-input v-model="criteria.hotel"></md-input>
    </md-input-container>
    <date-picker label="Ngày nhận" :model="criteria.checkin" :class="layout" />
    <date-picker label="Ngày trả" :model="criteria.checkout" :class="layout" />
    <md-button class="md-primary" @click="filter()">Search <span class="fa fa-search"/></md-button>
  </md-layout>
</template>
<script>
import datePicker from '@/controls/date-picker'
export default {
  props: ['layout'],
  components: {
    datePicker
  },
  data () {
    return {
      cities: ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'],
      criteria: {
        city: '',
        hotel: '',
        checkin: '23/10/2017',
        checkout: '23/10/2017'
      }
    }
  },
  methods: {
    filter () {
      this.$emit('filter', this.criteria)
    }
  }
}
</script>
<style lang="stylus">
@import '~src/themes/quasar.variables.styl'
.md-select-content.md-direction-bottom-right
  margin-left 0px
  &.md-active
    margin-top 2rem
.container
  .filter-box
    justify-content space-evenly
    .inline
      margin-left 8px
      width 20%
    .md-input-container
      margin-bottom 10px
@media screen and (max-width: 480px)
  .filter-box
    .inline
      width 100%
</style>
