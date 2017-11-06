import { QInput, QSelect, Loading, QSpinnerCircles } from 'quasar'
import listHotel from '@/controls/list-hotel'
import paginate from '@/controls/pagination'
import content from 'src/services/content-service'
export default {
  components: { 
    QInput,
    QSelect,
    listHotel,
    paginate,
    Loading,
    QSpinnerCircles
  },
  beforeRouteEnter(to, from, next) {
    Loading.show({
      delay: 100,
      spinner: QSpinnerCircles,
      spinnerSize: 100,
      spinnerColor: 'warning'
    })
    Promise.all([content.getListHotel()]).then(values => {
      Loading.hide()
      next(vm => {
        vm.listHotels = vm.getFirstList(values[0]['list'])
        vm.mainList = values[0]['list']
        vm.selectOptions = values[0]['selectOpt']
      })
    })
  },
  data() {
    return {
      hotelPerPage: 10,
      currentPage: 0,
      resultCount: 0,
      text: '',
      select: '',
      listHotels: [],
      mainList: [],
      selectOptions: []
    }
  },
  computed: {
    totalPages: function () {
      return Math.ceil(this.resultCount / this.hotelPerPage)
    }
  },
  methods: {
    setPage: function (current) {
      this.currentPage = current
      if(this.select === '' && this.text === '' || this.text === '') {
        this.getCurrentList(this.mainList)
      } else {
        this.getCurrentList(this.listHotels)
      }
    },
    getFirstList: function (list) {
      this.resultCount = list.length
      if (this.currentPage >= this.totalPages) {
        this.currentPage = this.totalPages - 1
      }
      var index = this.currentPage * this.hotelPerPage
      return list.slice(index, index + this.hotelPerPage)
    },
    getCurrentList: function (list) {
      this.resultCount = list.length
      this.currentPage--
      var index = this.currentPage * this.hotelPerPage
      this.listHotels = list.slice(index, index + this.hotelPerPage)
    },
    filteredList: function (list, e) {
      e.preventDefault()
      if (this.select !== '' && this.text !== '') {
        this.listHotels = list.filter((item) => {
          if (item.name.toLowerCase().indexOf(this.text.toLowerCase()) > -1 && item.value === this.select) {
            return item
          }
        })
      } else {
        if (this.select !== '') {
          this.listHotels = list.filter((item) => {
            if (item.value === this.select) {
              return item
            }
          })
        }
        if (this.text !== '') {
          this.listHotels = list.filter((item) => {
            if (item.name.toLowerCase().indexOf(this.text.toLowerCase()) > -1) {
              return item
            }
          })
        }
      }
      if (this.currentPage >= this.totalPages) {
        this.currentPage = this.totalPages
      }
      var index = this.currentPage * this.hotelPerPage
      this.listHotels = this.listHotels.slice(index, index + this.hotelPerPage)
    }
  },
}