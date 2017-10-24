<template>
  <div class="slider-container-sync">
    <div :class="itemClass(index)" v-for="(blog, index) in items" :key="index" @click="switchSlide(index)">
      <img :src="blog.img" alt="blog.alt">
      <div class="block-center">
        <div class="blog-title">{{blog.title}}</div>
      </div>
    </div>
    <!-- <div class="">
      <button class="prev" @click="prevSlide()">Prev</button>
      <button class="next" @click="nextSlide()">Next</button>
    </div> -->
  </div>
</template>
<script>
// import {QIcon, QDatetime} from 'quasar'
export default {
  props: ['items', 'current'],
  data () {
    return {
    }
  },
  methods: {
    itemClass: function (index) {
      if (this.current === index) {
        return 'slider-item-sync active'
      }
      else return 'slider-item-sync'
    },
    switchSlide: function (i) {
      this.$emit('switch', i)
    }
  }
}
</script>
