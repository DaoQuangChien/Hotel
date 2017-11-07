<template>
  <div class="col-lg-4 col-md-6 col-xs-12 room-item">
    <div class="room-card">
      <div class="summary">
        <div class="picture">
          <img :src="room.image" :alt="room.name">
        </div>
        <div class="info">
          <h3 class="name">{{room.name}}</h3>
          <p class="kind">Loại phòng: {{room.kind}}</p>
          <p class="facilities">{{room.facility}}</p>
        </div>
      </div>
      <div class="description">
        <label>Chi tiết</label>
        <div class="content">
          <p>{{room.description}}</p>
        </div>
      </div>
      <div class="price">{{room.price}}</div>
      <div class="quantity">{{room.quantity}}</div>
      <div class="btn-group">
        <button class="btn flat">Xóa</button>
        <button class="btn flat">Cập nhật</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['room']
  }
</script>
<style lang="stylus">
  @import '~variables'
  .room-item
    padding 0 10px 20px
    &:nth-child(3n+1)
      padding-left 0
    &:nth-child(3n)
      padding-right 0
  .summary
    display flex
    flex-direction row-reverse
  .grid
    @media(min-width: $screen-xs-max)
      .room-card
        position: relative
    .room-card
      standardShadow()
      standardBorderRadius()
      .btn-group
        clear both
      .summary
        position: relative
        .picture
          padding 5px
          img
            width: 100%
        @media(min-width $screen-sm-min)
          .info
            width 60%
          .picture
            width 40%
        @media(max-width $screen-xs-max)
          &
            flex-wrap wrap
          .info, .picture
            width 100%
        @media(min-width: $screen-xs-max)
          .name, .kind, .facilities
            white-space: nowrap
            text-overflow: ellipsis
            overflow: hidden
            margin-bottom 0
      .description
        .content
          overflow: hidden
          text-overflow: ellipsis
          max-height: 95px
        .content, .content *
          padding: 0px
        label
          font-weight: bold
          padding: 5px 0px
          display: inline-block
      .price, .quantity
        font-weight: bold
      .name, .kind, .facilities, .description, .price, .quantity
        padding: 5px 15px
      @media(min-width: $screen-xs-max)
        .price
          display: inline-block
          float: left
        .quantity
          display: inline-block
          float: right
</style>
