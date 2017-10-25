<template>
  <div class="slider-container-sync">
    <div class="slider-sync" :style="{'transform': 'translateX(' + distance + 'px)', isCenter}">
      <div :class="itemClass(index)" v-for="(blog, index) in items" :key="index" @click="switchSlide(index)" ref="itemSync">
        <img :src="blog.img" alt="blog.alt">
        <div class="block-center">
          <div class="blog-title">{{blog.title}}</div>
        </div>
      </div>
    </div>
    <div class="nav-slide-item">
      <button class="prev" @click="prevSlide()">Prev</button>
      <button class="next" @click="nextSlide()">Next</button>
    </div>
  </div>
</template>
<script>
// import {QIcon, QDatetime} from 'quasar'
export default {
  props: ['items', 'current'],
  data () {
    return {
      distance: 0
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
    },
    prevSlide () {
      this.distance += this.$refs.itemSync[0].offsetWidth
    },
    nextSlide () {
      this.distance -= this.$refs.itemSync[0].offsetWidth
    }
  },
  computed: {
    isCenter: function () {
      if (this.items.length < 3) {
        return 'justify-content: center'
      }
      else {
        return 'justify-content: flex-start'
      }
    }
  }
}
</script>
