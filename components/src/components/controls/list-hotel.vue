<template>
  <tr>
    <td>{{hotel.id}}</td>
    <router-link :to="{name: 'hotel-summary', params: {hotelID: hotel.id}}">
      <td>{{hotel.name}}</td>
    </router-link>
    <td>{{hotel.location}}</td>
    <td class="text-center">{{hotel.standard}}<span class="fa fa-star"></span></td>
    <td class="text-center">{{hotel.rated}}<span class="fa fa-star"></span></td>
    <td class="text-right">{{hotel.lowestPrice}}</td>
    <td class="text-right">{{hotel.highestPrice}}</td>
    <td class="text-right">{{hotel.roomQuantity}}</td>
  </tr>
</template>
<script>
  export default {
    props: ['hotel']
  }
</script>
<style lang="stylus">
  @import '~variables'
  .hotels
    a td
      color $dark
      &:hover
        color $primary
    @media (max-width: $screen-sm-min)
      td:nth-child(n + 6)
        display: none
    @media (max-width: $screen-xs-min)
      td:nth-child(n + 4)
        display: none
</style>
