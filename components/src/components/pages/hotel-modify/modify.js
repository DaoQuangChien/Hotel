import { QChipsInput, QCardMedia, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QCard, Loading, QSpinnerCircles, QInput, QDatetimeRange, QAutocomplete, QCheckbox, QIcon, QPopover, QList, QItem, QItemMain } from 'quasar'
import content from 'src/services/content-service'
import listPrice from '@/controls/list-price'
export default {
  components: {
    QChipsInput,
    QCardMedia,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    QBtn,
    QCard,
    QInput,
    QDatetimeRange,
    QAutocomplete,
    QCheckbox,
    QIcon,
    QPopover,
    QList,
    QItem,
    QItemMain,
    listPrice
  },
  data() {
    return {
      mode: 'add',
      event: 'event',
      price: 'price',
      both: 'both',
      view: 'both',
      editing: '',
      viewing: '',
      erasing: '',
      listEventsPrices: [],
      rangeDate: {
        from: null,
        to: null
      },
      today: new Date(),
      priceDescription: '',
      eventDescription: '',
      is_price_All_Checked: false,
      is_event_All_Checked: false,
      list_price_rooms: [],
      list_event_rooms: []
    }
  },
  beforeRouteEnter(to, from, next) {
    Loading.show({
      delay: 100,
      spinner: QSpinnerCircles,
      spinnerSize: 100,
      spinnerColor: 'warning'
    })
    Promise.all([content.getEventPrice()]).then(values => {
      Loading.hide()
      next(vm => {
        vm.listEventsPrices = values[0]
      })
    })
  },
  methods: {
    openDialog(ref, index) {
      if (index !== null) {
        this.erasing = index
      }
      this.mode = 'add'
      this.today = new Date()
      this.is_event_All_Checked = false
      this.is_price_All_Checked = false
      this.priceDescription = ''
      this.eventDescription = ''
      this.rangeDate = {
        from: null,
        to: null
      }
      this.list_price_rooms = []
      this.list_event_rooms = []
      this.$refs[ref].open()
    },
    closeDialog(ref) {
      this.$refs[ref].close()
    },
    edit(ref, index, v) {
      this.mode = 'edit'
      this.viewing = v
      this.editing = index
      this.today = ''
      this.rangeDate.from = this.listEventsPrices[index].from
      this.rangeDate.to = this.listEventsPrices[index].to
      this.eventDescription = this.listEventsPrices[index].event.description
      this.priceDescription = this.listEventsPrices[index].price.description
      if (this.listEventsPrices[index].event.apply === 'all') {
        this.is_event_All_Checked = true
      }
      else {
        this.is_event_All_Checked = false
      }
      if (this.listEventsPrices[index].price.apply === 'all') {
        this.is_price_All_Checked = true
      }
      else {
        this.is_price_All_Checked = false
      }
      if (!this.is_event_All_Checked && this.listEventsPrices[index].event.apply.length > 0) {
        this.list_event_rooms = this.listEventsPrices[index].event.apply.split(',')
      }
      else {
        this.list_event_rooms = []
      }
      if (!this.is_price_All_Checked && this.listEventsPrices[index].price.apply.length > 0) {
        this.list_price_rooms = this.listEventsPrices[index].price.apply.split(',')
      }
      else {
        this.list_price_rooms = []
      }
      this.$refs[ref].open()
    },
    save(ref) {
      let newEventPrice = {
        from: null,
        to: null,
        event: {
          description: '',
          apply: []
        },
        price: {
          description: '',
          apply: []
        }
      }
      switch (this.mode) {
        case 'add':
          newEventPrice.from = this.convertDate(this.rangeDate.from)
          newEventPrice.to = this.convertDate(this.rangeDate.to)
          newEventPrice.event.description = this.eventDescription
          newEventPrice.price.description = this.priceDescription
          if (this.is_price_All_Checked) {
            newEventPrice.price.apply = 'Tất cả các phòng'
          }
          else {
            newEventPrice.price.apply = this.list_price_rooms.join(', ')
          }
          if (this.is_event_All_Checked) {
            newEventPrice.event.apply = 'Tất cả các phòng'
          }
          else {
            newEventPrice.event.apply = this.list_event_rooms.join(', ')
          }
          this.listEventsPrices.unshift(newEventPrice)
          break
        case 'edit':
          this.listEventsPrices[this.editing].from = this.convertDate(this.rangeDate.from)
          this.listEventsPrices[this.editing].to = this.convertDate(this.rangeDate.to)
          this.listEventsPrices[this.editing][this.viewing].description = this[this.viewing + 'Description']
          if (this['is_' + this.viewing + '_All_Checked']) {
            this.listEventsPrices[this.editing][this.viewing].apply = 'Tất cả các phòng'
          }
          else {
            if (this['list_' + this.viewing + '_rooms'].length > 0) {
              this.listEventsPrices[this.editing][this.viewing].apply = this['list_' + this.viewing + '_rooms'].join(', ')
            }
            else {
              this.listEventsPrices[this.editing][this.viewing].apply = []
            }
          }
          break
        default:
          newEventPrice.from = this.convertDate(this.rangeDate.from)
          newEventPrice.to = this.convertDate(this.rangeDate.to)
          newEventPrice.event.description = this.eventDescription
          newEventPrice.price.description = this.priceDescription
          if (this.is_price_All_Checked) {
            newEventPrice.price.apply = 'Tất cả các phòng'
          }
          else {
            newEventPrice.price.apply = this.list_price_rooms.join(', ')
          }
          if (this.is_event_All_Checked) {
            newEventPrice.event.apply = 'Tất cả các phòng'
          }
          else {
            newEventPrice.event.apply = this.list_event_rooms.join(', ')
          }
          this.listEventsPrices.unshift(newEventPrice)
          break
      }
      this.$refs[ref].close()
    },
    erase() {
      let tmpPrices = this.listEventsPrices
      tmpPrices = tmpPrices.splice(this.erasing, 1)
      this.closeDialog('dialogErase')
    },
    switchView(v) {
      this.view = v
      this.$refs.toggleMode.close()
    },
    convertDate(time) {
      let date = new Date(time)
      date = date.toLocaleDateString().split('/')
      return date[1] + '/' + date[0] + '/' + date[2]
    },
    openPopover() {
      switch (this.view) {
        case 'event':
          this.$refs.toggleMode.$el.classList.add('first')
          this.$refs.toggleMode.$el.classList.remove('second')
          this.$refs.toggleMode.$el.classList.remove('third')
          break
        case 'price':
          this.$refs.toggleMode.$el.classList.add('second')
          this.$refs.toggleMode.$el.classList.remove('first')
          this.$refs.toggleMode.$el.classList.remove('third')
          break
        default:
          this.$refs.toggleMode.$el.classList.add('third')
          this.$refs.toggleMode.$el.classList.remove('first')
          this.$refs.toggleMode.$el.classList.remove('second')
          break
      }
    }
  }
};
