<template>
  <div v-if="shown" class="calendar" :style="position">
    <md-layout class="calendar-header">
      <span class="fa fa-angle-left" @click="prev()"></span>
      <div class="calendar-title">{{viewingMonth}}</div>
      <span class="fa fa-angle-right" @click="next()"></span>
    </md-layout>
    <md-layout class="calendar-content">
      <md-layout class="calendar-week header">
        <div class="calendar-day" :key="day" v-for="day in weekDays">{{day}}</div>
      </md-layout>
      <md-layout class="calendar-week" :key="index" v-for="week, index in weeks">
        <div class="calendar-day" @click="select(day, index)" :key="day" v-for="day in week">{{day}}</div>
      </md-layout>
    </md-layout>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      shown: false,
      parent: null,
      date: moment(),
      month: null,
      position: '',
      weekDays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    }
  },
  computed: {
    value () {
      return this.date
    },
    viewingMonth () {
      if (this.month) {
        return this.month
      }
      return this.date.format('MMM YYYY')
    },
    weeks () {
      let current = moment(this.viewingMonth, 'MMM YYYY')
      let endOfMonth = moment(this.viewingMonth, 'MMM YYYY').endOf('M')
      let weeks = []
      let days = null
      while (current.isSameOrBefore(endOfMonth)) {
        if (current.day() === 0 || days === null) {
          days = [null, null, null, null, null, null, null]
          weeks.push(days)
        }
        days[current.day()] = current.date()
        current.add(1, 'd')
      }
      return weeks
    }
  },
  mounted () {
    this.parent = this.$el.parentElement
  },
  methods: {
    dayClass (day) {
      return day
    },
    show () {
      var self = this
      self.shown = true
      document.body.append(this.$el)
      let top = this.parent.offsetTop + this.parent.offsetHeight
      if (top + this.$el.offsetHeight > window.innerHeight) {
        top = this.parent.offsetTop - this.$el.offsetHeight
      }
      let left = this.parent.offsetLeft
      if (left + this.$el.offsetWidth > window.innerWidth) {
        left = this.parent.offsetLeft - this.$el.offsetWidth
      }
      this.position = `top: ${top}px; left: ${left}px`
      window.addEventListener('click', this.dispatch, false)
    },
    hide () {
      this.shown = false
    },
    select (day, index) {
      if (day) {
        this.date = moment(this.viewingMonth, 'MMM YYYY').add(day - 1, 'd')
      }
      else {
        this.date = moment(this.viewingMonth, 'MMM YYYY').add(index > 0 ? 1 : -1, 'M')
      }
      this.hide()
      this.$emit('select', this.date)
    },
    next () {
      this.month = moment(this.viewingMonth, 'MMM YYYY').add(1, 'M').format('MMM YYYY')
    },
    prev () {
      this.month = moment(this.viewingMonth, 'MMM YYYY').subtract(1, 'M').format('MMM YYYY')
    },
    dispatch (event) {
      if (this.isClickedOnCalendar(event)) {
        console.log('Click on calendar')
      }
      else {
        this.hide()
        window.removeEventListener('click', this.dispatch)
        event.stopPropagation()
      }
    },
    isCalendar (el) {
      return el && el.contains('calendar')
    },
    isClickedOnCalendar (event) {
      return event.path.filter(el => this.isCalendar(el.classList) || el === this.parent).length > 0
    }
  }
}
</script>
<style lang="stylus">
@import '~variables'
.calendar
  position absolute
  width 280px
  border-radius 2px
  box-shadow 0px 1px 4px $dark
  background $dark
  border 1px solid $dark
  color white
  .calendar-header
    padding 5px
    font-size 1.15rem
    line-height 1.15rem
    background $warning
    .fa
      cursor pointer
    .calendar-title
      flex 1
      text-align center
  .calendar-content
    width 100%
    display block
    .calendar-week
      width 100%
      &.header
        border-bottom 1px solid $warning
      .calendar-day
        text-align center
        display inline-block
        width calc(100%/7)
      &:not(.header)
        .calendar-day
          cursor pointer
      .null
        .calendar-day
          cursor none
</style>
