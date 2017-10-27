import { QProgress } from 'quasar'
const MAX_TIME = 10
export default {
  components: {
    QProgress
  },
  data() {
    return {
      redirect : String
    }
  },
  mounted() {
    var self = this
    var time = 0
    var tryToConnect = setInterval(function() {
      self.$store.dispatch('login').then(success => {
        console.log('lg')
        if(success) {
          console.log(self.$store.getters.user.name)
          clearInterval(tryToConnect)
          self.$router.replace(self.redirect ? self.redirect : '/')
        }
        if(time >= MAX_TIME){
          clearInterval(tryToConnect)
          self.$router.replace('/')
        }
        time++
      })
    }, 1000)
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log(to.query.redirect)
      vm.redirect = to.query.redirect
    })
  }
}
