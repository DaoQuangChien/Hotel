<template>
  <div>
    <h3 class="introduction">
      {{$t('message.ongoing')}}
    </h3>
    <div class="message" v-html="$t('message.ongoing-detail')">
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="stylus">
@import '~variables'
.introduction, .message
  text-align center
.introduction
  margin 0px
  padding 30px
  background $warning
  color white
  text-transform uppercase
.message
  padding 15px
  .caption
    font-size 1.6rem
    padding 10px
</style>
