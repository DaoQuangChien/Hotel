import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/pages/${component}/main.vue`)
}

const router = new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    {
      path: '/admin',
      component: load('master-admin'),
      children: [
        {
          name: 'dashboard',
          path: 'dashboard',
          component: load('dashboard')
        },
        {
          name: 'hotel',
          path: 'hotel',
          component: load('hotel')
        },
        {
          name: 'hotel-menu',
          path: 'hotel/hotel-menu',
          component: load('hotel-menu'),
          children: [
            {
              name: 'hotel-summary',
              path: 'hotel-summary/:hotelID',
              component: load('hotel-summary')
            },
            {
              name: 'hotel-event',
              path: 'hotel-event',
              component: load('hotel-event')
            },
            {
              name: 'hotel-room',
              path: 'hotel-room',
              component: load('hotel-room')
            },
            {
              name: 'hotel-price',
              path: 'hotel-price',
              component: load('hotel-price')
            }
          ]
        },
        {
          name: 'userManagement',
          path: 'userManagement',
          component: load('userManagement')
        },
        {
          name: 'rss',
          path: 'rss',
          component: load('rss')
        },
        {
          name: 'layoutManagement',
          path: 'layoutManagement',
          component: load('layoutManagement')
        }
      ]
    },

    {
      path: '/',
      component: load('master'),
      children: [
        {
          name: 'index',
          path: 'home',
          component: load('home')
        },
        {
          name: 'hotels',
          path: 'hotels',
          component: load('hotels')
        },
        {
          name: 'hotel-details',
          path: 'hotels/:hotelId',
          component: load('hotel-details')
        },
        {
          name: 'blog-details',
          path: 'blogs/:newsId',
          component: load('blog-details')
        },
        {
          name: 'blogs',
          path: 'blogs',
          component: load('blogs')
        },
        {
          name: 'feedback',
          path: 'feedback',
          component: load('feedback')
        },
        {
          name: 'about',
          path: 'about',
          component: load('about')
        }
      ]
    },
    {
      path: 'login',
      component: load('login')
    },
    {
      path: 'register',
      component: load('register')
    },

    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '') {
    next({path: '/home'})
  }
  next()
})
export default router
