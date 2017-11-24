<template>
  <div class="col-lg-4 col-md-6 col-xs-12 room-item">
    <q-card inline class="bigger">
      <q-card-media>
        <img :src="room.image" :alt="room.name">
      </q-card-media>
      <q-card-title>
        {{room.name}}
        <span class="subtitle" slot="subtitle">Loại phòng: {{room.kind}}</span>
        <span class="subtitle" slot="subtitle">Tiện ích: {{room.facility}}</span>
      </q-card-title>
      <q-card-main>
        <p>Chi tiết</p>
        <p class="text-faded">{{room.description}}</p>
        <p class="price">Giá: {{room.price}}</p>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat color="teriary">Xóa</q-btn>
        <q-btn flat color="primary">Cập nhật</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
  import { QChipsInput, QOptionGroup, QCardMedia, QCardTitle, QRating, QIcon, QCardMain, QCardSeparator, QCardActions, QBtn, QCard, QTransition } from 'quasar'
  export default {
    components: {
      QChipsInput,
      QOptionGroup,
      QCardMedia,
      QCardTitle,
      QRating,
      QIcon,
      QCardMain,
      QCardSeparator,
      QCardActions,
      QBtn,
      QCard,
      QTransition
    },
    props: ['room']
  }
</script>
<style lang="stylus">
  // @import '~variables'
  .subtitle
    display block
  .price
    font-weight bold
</style>
