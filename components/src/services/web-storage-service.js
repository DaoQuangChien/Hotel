import { LocalStorage, SessionStorage } from 'quasar'

export default {
  'local': {
    get (key) {
      return LocalStorage.get.item(key)
    },
    set (key, val) {
      LocalStorage.set(key, val)
    },
    remove (key) {
      LocalStorage.remove(key)
    }
  },
  'session': {
    get (key) {
      return SessionStorage.get.item(key)
    },
    set (key, val) {
      SessionStorage.set(key, val)
    },
    remove (key) {
      SessionStorage.remove(key)
    }
  }
}
