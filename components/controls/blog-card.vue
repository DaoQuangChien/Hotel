<template>
  <md-layout class="news" :class="layout">
    <div class="image">
      <router-link tag="img" :to="{ name: 'blog-details', params: {newsId: news.id} }" :src="news.image.src" :alt="news.image.alt" />
    </div>
    <div class="content">
      <md-layout class="news-title">
      <router-link :to="{ name: 'blog-details', params: {newsId: news.id} }">{{news.title}}</router-link>
      </md-layout>
      <div class="news-author"><span class="fa fa-pencil"></span>{{$t('label.author')}} <b>{{news.modifiedBy}}</b> {{$t('label.at')}} {{news.modifiedAt}}</div>
      <div class="summary">{{news.summary}}</div>
    </div>
  </md-layout>
</template>
<script>
export default {
  props: ['news', 'layout']
}
</script>
<style lang="stylus">
@import '~variables'
$font-size = 16px
$line-height = 1rem
$lines-to-show = 4

.news
  .image
    width 40%
    padding 0px 30px 30px 0px
    img
      cursor pointer
  .content
    width 60%
    .news-title
      font-weight bold
      text-transform uppercase
    .news-author
      padding 10px 0px 20px 0px
      .fa
        margin-right 5px
  &:nth-child(2n + 1)
    margin 20px 0px
  &.block
    .image, .content
      display block
      width 100%
.news
  .content
    .summary
      display: block; /* Fallback for non-webkit */
      display: -webkit-box;
      height: $font-size*$line-height*$lines-to-show; /* Fallback for non-webkit */
      margin: 0 auto;
      font-size: $font-size;
      line-height: $line-height;
      -webkit-line-clamp: $lines-to-show;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;

</style>
