import ckEditor from '@/controls/ckeditor'
// import hotel from 'src/services/hotel-service'
import { QInput, QSelect } from 'quasar'
export default {
  components: { ckEditor, QInput, QSelect },
  data() {
    return {
      text: '',
      citySelected: '',
      cityOptions: [
        {
          label: 'Hồ Chí Minh',
          value: 'TPHCM'
        },
        {
          label: 'Hà Nội',
          value: 'HN'
        },
        {
          label: 'Đà Nẵng',
          value: 'DN'
        },
        {
          label: 'Nha Trang',
          value: 'NT'
        }
      ],
      districtSelected: '',
      districtOptions: [
        {
          label: 'Quận 9',
          value: 'Q9'
        },
        {
          label: 'Thủ Đức',
          value: 'TD'
        },
        {
          label: 'Bình Thạnh',
          value: 'BT'
        },
        {
          label: 'Gò Vấp',
          value: 'GV'
        }
      ]
    }
  }
  // beforeRouteEnter: (to, from, next) => {
  //   hotel.getHotelDetails(to.params.hotelId).then(result => {
  //     next(vm => {
  //       vm.hotelDetail = result
  //     })
  //   })
  // }
}