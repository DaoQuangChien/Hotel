import ckEditor from '@/controls/ckeditor'
// import hotel from 'src/services/hotel-service'
import { QInput, QSelect } from 'quasar'
export default {
  components: { ckEditor, QInput, QSelect },
  data() {
    return {
      id: 'ht-1',
      text: '',
      citySelected: '',
      content: '<figure class="image image-illustration" style="float:left"><img alt="" height="266" src="http://c.cksource.com/a/1/img/demo/brownie.jpg" width="400" /> <figcaption>Bon App&amp;eacute;tit!</figcaption></figure> <h2>CKEditor Brownies</h2> <h3>Ingredients:</h3> <ul> <li>½ cup flour</li> <li>1 cup sugar</li> <li>½ cup butter, melted</li> <li>2 eggs</li> <li>1/3 cup cocoa powder</li> </ul> <p>Preheat the oven to <strong>350°F</strong> and grease the baking pan. Combine the flour, sugar and cocoa powder in a medium bowl. In another small bowl, whisk together the butter and eggs. Stir the two mixtures until just combined. Bake the brownies for 25 to 35 minutes. Remove from the oven and let it cool for 5 minutes. </p>',
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