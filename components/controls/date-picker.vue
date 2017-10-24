<template>
  <md-input-container class="md-date-picker">
    <label>{{label}}</label>
    <md-input ref="input" v-model="model" @focus="$refs.calendar.show()" @click="$refs.calendar.show()"></md-input>
    <span class="fa fa-calendar" @click="$refs.calendar.show()"/>
    <calendar ref="calendar" @select="select"/>
  </md-input-container>
</template>
<script>
import calendar from '@/controls/calendar'
export default {
  props: ['label', 'model'],
  components: {
    calendar
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    select (date) {
      this.$refs.input.$el.value = date.format('DD/MM/YYYY')
    }
  }
}
</script>
<style lang="stylus">
.md-date-picker
  .fa
    line-height 32px
    cursor pointer
</style>
