<template>
  <div :class="wrapperClass" :style="{'transform': 'translate('+currentSlide+'%)'}">
    <div class="slider-item" v-for="(blog, index) in items" :key="index">
      <img :src="blog.img" alt="blog.alt">
      <div class="block-center">
        <div class="blog-title">{{blog.title}}</div>
        <span class="">{{blog.price}}</span>
        <div class="blog-description">{{blog.shortDescription}}</div>
        <button class="flat-btn readmore" @click="readMore(blog.link)">{{$t('button.details')}}</button>
        <slot name="buttonPlaceholder" text="Book"></slot>
      </div>
    </div>
  </div>
</template>
<script>
// import {QIcon, QDatetime} from 'quasar'
export default {
  props: ['items', 'wrapperClass', 'current'],
  data () {
    return {
    }
  },
  methods: {
    readMore (item) {
      this.$emit('read', item)
    }
  },
  computed: {
    currentSlide: function () {
      return -100 * this.current || 0
    }
  }
}
</script>
<style lang="stylus">
@import '~src/themes/quasar.variables.styl'
</style>
