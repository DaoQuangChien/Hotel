import listRoom from '@/controls/list-room'
import { QInput, QSelect, Loading, QSpinnerCircles } from 'quasar'
import content from 'src/services/content-service'
export default {
  components: {
    listRoom,
    QInput,
    QSelect,
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
    Promise.all([content.getListRoom()]).then(values => {
      Loading.hide()
      next(vm => {
        vm.listRooms = values[0]['list']
        vm.mainList = values[0]['list']
        vm.selectOptions = values[0]['selectOpt']
      })
    })
  },
  data() {
    return {
      text: '',
      select: '',
      listRooms: [],
      mainList: [],
      selectOptions: []
    }
  },
}