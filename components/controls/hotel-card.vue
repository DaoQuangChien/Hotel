<template>
  <div class="card">
    <img :src="image.src" :alt="image.alt" />
    <md-layout class="card-title">
      <div class="card-name">{{name}}</div>
      <div class="price">{{formattedPrice}}</div>
    </md-layout>
    <div class="card-rating"><span class="fa fa-star" v-for="star in stars"></span></div>
    <div>{{summary}}</div>
    <div class="group-btn">
      <router-link class="flat-btn round" :to="{ name: 'hotel-details', params: {hotelId: hid} }" tag="button">{{$t('button.details')}}</router-link>
    </div>
  </div>
</template>
<script>
export default {
  props: ['hid', 'image', 'rating', 'name', 'price', 'summary'],
  computed: {
    formattedPrice () {
      return `${Number.parseInt(this.price).toLocaleString()} VND`
    },
    stars () {
      return Math.floor(this.rating)
    }
  }
}
</script>
<style lang="stylus">
@import '~variables'
.card
  .card-title
    padding 30px 0px
    font-weight bold
    text-transform uppercase
    .card-name
      flex 1
  .card-rating
    padding 0px 0px 10px 0px
    color $warning
    .fa
      padding 2px
  .group-btn
    button
      float right
  &:nth-child(3n + 2)
    margin 0px 20px
</style>
