import imageSlider from '@/controls/image-slider'
import sliderBlock from '@/controls/slider-block'
import hotelFilterBox from '@/controls/hotel-filter-box'
import hotelCard from '@/controls/hotel-card'
import blogCard from '@/controls/blog-card'
import { Loading, QSpinnerCircles } from 'quasar'
import content from 'src/services/content-service'

export default {
  components: {
    imageSlider,
    hotelFilterBox,
    sliderBlock,
    hotelCard,
    blogCard
  },
  beforeRouteEnter (to, from, next) {
    Loading.show({
      delay: 100,
      spinner: QSpinnerCircles,
      spinnerSize: 100,
      spinnerColor: 'warning'
    })
    Promise.all([content.getTopHotels(), content.getTopNews()]).then(values => {
      Loading.hide()
      next(vm => {
        console.log(values[0])
        vm.topHotels = values[0]
        vm.firstTopNews = values[1][0]
        vm.topNews = values[1].slice(1)
      })
    })
  },
  data () {
    return {
      'blogs': [{'img': '/statics/home_slider_03.jpg', 'alt':'Landscape', 'title': "Let's discover the world together", 'shortDescription': 'Template based on deep research on the most popular travel booking websites such as  booking.com, tripadvisor, yahoo travel, expedia, priceline, hotels.com, travelocity, kayak, orbitz, etc.  This guys can’t be wrong. You should definitely give it a shot :)', 'link': '#'}],
      'topPlaces': [{'img': '/statics/switzerland-landscape.jpg', 'alt':'switzerland', 'title': "switzerland - the holiday", 'price': 'From 450$', 'shortDescription': 'Template based on deep research on the most popular travel booking websites such as  booking.com, tripadvisor, yahoo travel, expedia, priceline, hotels.com, travelocity, kayak, orbitz, etc.  This guys can’t be wrong. You should definitely give it a shot :)', 'link': '#switzerland'}, {'img': '/statics/fansipan-5.jpg', 'alt':'fansipan', 'title': "fansipan - the holiday", 'price': 'From 450$', 'shortDescription': 'Template based on deep research on the most popular travel booking websites such as  booking.com, tripadvisor, yahoo travel, expedia, priceline, hotels.com, travelocity, kayak, orbitz, etc.  This guys can’t be wrong. You should definitely give it a shot :)', 'link': '#fansipan'}, {'img': '/statics/switzerland-landscape.jpg', 'alt':'switzerland', 'title': "switzerland - the holiday", 'price': 'From 450$', 'shortDescription': 'Template based on deep research on the most popular travel booking websites such as  booking.com, tripadvisor, yahoo travel, expedia, priceline, hotels.com, travelocity, kayak, orbitz, etc.  This guys can’t be wrong. You should definitely give it a shot :)', 'link': '#switzerland'}, {'img': '/statics/fansipan-5.jpg', 'alt':'fansipan', 'title': "fansipan - the holiday", 'price': 'From 450$', 'shortDescription': 'Template based on deep research on the most popular travel booking websites such as  booking.com, tripadvisor, yahoo travel, expedia, priceline, hotels.com, travelocity, kayak, orbitz, etc.  This guys can’t be wrong. You should definitely give it a shot :)', 'link': '#fansipan'}],
      topHotels: [],
      topNews: [],
      firstTopNews: null
    }
  },
  methods: {
    readhome (link) {
      console.log(link)
    },
    filter (criteria) {
      console.log(criteria)
    }
  }
}
