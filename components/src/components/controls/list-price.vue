<template>
  <div class="col-md-3 col-sm-4 col-xs-12">
    <q-card>
      <div class="card-container">
        <q-card-title>
          {{getDate(info.from)}} - {{getDate(info.to)}}
          <span slot="subtitle">{{getSubtitle(view)}}</span>
          <q-icon slot="right" name="more_vert">
            <q-popover ref="popover" class="changeList" @open="open">
              <q-list link class="no-border">
                <q-item @click="switchView('event')" >
                  <span class="fa fa-calendar"></span>
                  <q-item-main label="Khuyến mãi" />
                </q-item>
                <q-item @click="switchView('price')">
                  <span class="fa fa-usd"></span>
                  <q-item-main label="Thời giá" />
                </q-item>
              </q-list>
            </q-popover>
          </q-icon>
        </q-card-title>
        <q-card-main>
          <p>{{renderDescription(info[view].description)}}</p>
          <p>Áp dụng: {{listApply(info[view].apply)}}</p>
        </q-card-main>
        <!-- <q-card-main v-if="view === 'event'">
          <p>{{event.description}}</p>
          <p>Áp dụng: {{listApply(event.apply)}}</p>
        </q-card-main> -->
        <q-card-separator />
        <q-card-actions>
          <q-btn flat @click="editPrice('dialogPrice', pos, view)" color="primary">
            <span class="fa fa-pencil-square-o"></span>
            Chỉnh sửa
          </q-btn>
          <q-btn flat @click="drop('dialogErase', pos)" color="teriary">
            <span class="fa fa-trash"></span>
            Xóa
          </q-btn>
        </q-card-actions>
      </div>
    </q-card>
  </div>
</template>
<script>
  import { QCardMedia, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QCard, QIcon, QPopover, QList, QItem, QItemMain } from 'quasar'
  export default {
    components: {
      QCardMedia,
      QCardTitle,
      QCardMain,
      QCardSeparator,
      QCardActions,
      QBtn,
      QCard,
      QIcon,
      QPopover,
      QList,
      QItem,
      QItemMain
    },
    props: ['info', 'pos'],
    data () {
      return {
        view: 'event'
      }
    },
    methods: {
      editPrice (ref, key, v) {
        this.$emit('edit', ref, key, v)
      },
      drop (ref, key) {
        this.$emit('drop', ref, key)
      },
      renderDescription (des) {
        if (des.length > 0) {
          return des
        }
        else {
          return 'Vui lòng thêm mô tả'
        }
      },
      listApply (list) {
        if (list.length > 0) {
          if (list === 'all') {
            return 'Tất cả các phòng'
          }
          return list
        }
        else {
          return 'Vui lòng chọn phòng'
        }
      },
      getDate (time) {
        let date = time.split('/')
        return date[1] + '/' + date[0] + '/' + date[2]
      },
      getSubtitle (view) {
        if (view === 'event') {
          return 'Khuyến mãi'
        }
        if (view === 'price') {
          return 'Thời giá'
        }
      },
      switchView (v) {
        this.view = v
        this.$refs.popover.close()
      },
      open () {
        if (this.view === 'event') {
          this.$refs.popover.$el.classList.add('first')
          this.$refs.popover.$el.classList.remove('second')
        }
        if (this.view === 'price') {
          this.$refs.popover.$el.classList.add('second')
          this.$refs.popover.$el.classList.remove('first')
        }
      }
    }
  }
</script>
<style lang="stylus">
  .card-container
    .q-card-title-extra
      align-self flex-start
  .q-card-title 
    font-weight bold
  .changeList
    .q-item
      align-items baseline
    .fa
      margin-right 5px
</style>
