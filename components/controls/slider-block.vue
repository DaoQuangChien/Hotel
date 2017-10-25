<template>
  <div class="frame">
    <imageSlider :items="items" @read="read" :wrapper-class="wrapperClass" :current="current" :isNext="isNext">
      <button v-if="bookButton" slot="buttonPlaceholder" slot-scope={text} class="flat-btn round">{{text}}</button>
    </imageSlider>
    <imageSliderSync :items="items" :current="current" @switch="switchSlide"/>
    <div v-if="navButton" class="nav">
      <button class="prev" @click="prevSlide()">Prev</button>
      <button class="next" @click="nextSlide()">Next</button>
    </div>
  </div>
</template>
<script>
import imageSlider from '@/controls/image-slider'
import imageSliderSync from '@/controls/image-slider-sync'
import QIcon from 'quasar'
export default {
  components: {
    imageSlider,
    imageSliderSync,
    QIcon
  },
  props: ['items', 'wrapperClass', 'bookButton', 'navButton'],
  data () {
    return {
      current: 0,
      isNext: true
    }
  },
  methods: {
    read (link) {
      this.$emit('read', link)
    },
    nextSlide () {
      this.isNext = true
      this.current++
      if (this.current >= this.items.length) {
        this.current = 0
      }
    },
    prevSlide () {
      this.isNext = false
      this.current--
      if (this.current < 0) {
        this.current = this.items.length - 1
      }
    },
    switchSlide (index) {
      index > this.current ? this.isNext = true : this.isNext = false
      this.current = index
    }
  }
}
</script>