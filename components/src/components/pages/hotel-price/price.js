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
  data() {
    return {
      stars: 4,
      group: 'op1',
      mode: 'watch',
      clicked: ''
    }
  },
  methods: {
    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    },
    onOpen() {
      console.log('Opened');
    },
    onClose(type) {
      console.log('Closed', type);
    },
    edit() {
      this.mode = 'leave';
      this.clicked = 'editBtn';
    },
    update() {
      this.mode = 'leave';
      this.clicked = 'updateBtn'
    },
    drop() {
      console.log(1);
    },
    cancel() {
      console.log(2);
    },
    changeMode() {
      switch (this.clicked) {
        case 'editBtn':
          this.mode = 'edit';
          break;
        case 'updateBtn':
          this.mode = 'watch';
          break;
        default:
          this.mode = 'edit';
          break;
      }
    }
  }
};
