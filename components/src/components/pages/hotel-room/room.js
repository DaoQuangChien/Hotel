import listRoom from '@/controls/list-room'
import Ckeditor from '@/controls/ckeditor'
import { QInput, QSelect, Loading, QSpinnerCircles, QOptionGroup, QChipsInput, QUploader } from 'quasar'
import content from 'src/services/content-service'
export default {
  components: {
    listRoom,
    Ckeditor,
    QInput,
    QSelect,
    Loading,
    QSpinnerCircles,
    QOptionGroup,
    QChipsInput,
    QUploader
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
      singleList: {},
      selectOptions: [],
      group: 'op1',
      url: '',
      is_multiple: false,
      roomName: '',
      roomKind: '',
      roomFacilities: [],
      roomPrice: '',
      content: '',
      id: 'editorAdd'
    }
  },
  methods: {
    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    }
  }
}