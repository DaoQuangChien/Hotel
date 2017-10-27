import http from 'src/services/http-service'

function getLogo () {
  return http.get('/content/logo')
    .then(res => res.data)
    .catch(error => {
      console.debug(error)
      return {'src': '/statics/bookme1_1x.png', 'alt': 'Logo book me'}
    })
}

function getCover () {
  return http.get('/content/cover')
    .then(res => res.data)
    .catch(error => {
      console.debug(error)
      return {
        'image': {'src': '/statics/home_slider_03.jpg', 'alt': 'Discover bookme'},
        'title': 'LET\'S DISCOVER THE WORLD TOGETHER',
        'description': 'Template based on deep research on the most popular travel booking websites such as booking.com, tripadvisor, yahoo travel, expedia, priceline, hotels.com, travelocity, kayak, orbitz, etc. This guys can’t be wrong. You should definitely give it a shot :)',
        'link': '#'
      }
    })
}

function getTopHotels () {
  return http.get('/top/hotel')
    .then(res => res.data)
    .catch(error => {
      console.debug(error)
      return [
        {
          id: 1,
          name: 'VALLE AURINA',
          rate: 4.5,
          minPrice: '1000000',
          maxPrice: '5000000',
          summary: 'Khách sạn sang trọng, view đẹp đầy đủ mọi tiện nghi. Thích hợp cho những ai muốn tìm một nơi để thư giãn vào những dịp lễ.',
          description: '<p>Khách sạn sang trọng, view đẹp đầy đủ mọi tiện nghi. Thích hợp cho những ai muốn tìm một nơi để thư giãn vào những dịp lễ.</p>',
          localtion: 'Hồ Chí Minh',
          address: '43 Bùi Viện, Quận 1',
          type: 'Hotel',
          images: [
            {
              src: '/statics/hotels/hotel_01.png',
              alt: 'KS Mường Thanh'
            }
          ]
        },
        {
          id: 2,
          name: 'DELUXE HOTEL',
          rate: 4.5,
          minPrice: '1000000',
          maxPrice: '5000000',
          summary: 'Khách sạn sang trọng, view đẹp đầy đủ mọi tiện nghi. Thích hợp cho những ai muốn tìm một nơi để thư giãn vào những dịp lễ.',
          description: '<p>Khách sạn sang trọng, view đẹp đầy đủ mọi tiện nghi. Thích hợp cho những ai muốn tìm một nơi để thư giãn vào những dịp lễ.</p>',
          localtion: 'Hồ Chí Minh',
          address: '43 Bùi Viện, Quận 1',
          type: 'Hotel',
          images: [
            {
              src: '/statics/hotels/hotel_02.png',
              alt: 'KS Mường Thanh'
            }
          ]
        },
        {
          id: 3,
          name: 'Mường thanh',
          rate: 4.5,
          minPrice: '1000000',
          maxPrice: '5000000',
          summary: 'Khách sạn sang trọng, view đẹp đầy đủ mọi tiện nghi. Thích hợp cho những ai muốn tìm một nơi để thư giãn vào những dịp lễ.',
          description: '<p>Khách sạn sang trọng, view đẹp đầy đủ mọi tiện nghi. Thích hợp cho những ai muốn tìm một nơi để thư giãn vào những dịp lễ.</p>',
          localtion: 'Hồ Chí Minh',
          address: '43 Bùi Viện, Quận 1',
          type: 'Hotel',
          images: [
            {
              src: '/statics/hotels/hotel_03.png',
              alt: 'KS Mường Thanh'
            }
          ]
        }
      ]
    })
}

function getTopNews () {
  return http.get('/top/news')
    .then(res => res.data)
    .catch(error => {
      console.debug(error)
      return [
        {
          'id': 1,
          'title': 'Du lịch Sài Gòn: Cẩm nang từ A đến Z',
          'summary': 'Bookme.com giới thiệu Cẩm nang du lịch Sài Gòn đầy đủ và súc tích nhất, giới thiệu các điểm đến và món ăn ngon khi bạn có dịp du lịch tới “Hòn ngọc Viễn Đông”.',
          'modifiedBy': 'Vu vu vi',
          'modifiedAt': '12:48 19/10/2017',
          'image': {
            'src': '/statics/news/news_01.jpg',
            'alt': 'Du lịch Sài Gòn: Cẩm nang từ A đến Z'
          }
        },
        {
          'id': 2,
          'title': 'Du lịch Sài Gòn: Cẩm nang từ A đến Z',
          'summary': 'Bookme.com giới thiệu Cẩm nang du lịch Sài Gòn đầy đủ và súc tích nhất, giới thiệu các điểm đến và món ăn ngon khi bạn có dịp du lịch tới “Hòn ngọc Viễn Đông”.',
          'modifiedBy': 'Vu vu vi',
          'modifiedAt': '12:48 19/10/2017',
          'image': {
            'src': '/statics/news/news_01.jpg',
            'alt': 'Du lịch Sài Gòn: Cẩm nang từ A đến Z'
          }
        },
        {
          'id': 3,
          'title': 'Du lịch Sài Gòn: Cẩm nang từ A đến Z',
          'summary': 'Bookme.com giới thiệu Cẩm nang du lịch Sài Gòn đầy đủ và súc tích nhất, giới thiệu các điểm đến và món ăn ngon khi bạn có dịp du lịch tới “Hòn ngọc Viễn Đông”.',
          'modifiedBy': 'Vu vu vi',
          'modifiedAt': '12:48 19/10/2017',
          'image': {
            'src': '/statics/news/news_01.jpg',
            'alt': 'Du lịch Sài Gòn: Cẩm nang từ A đến Z'
          }
        },
        {
          'id': 4,
          'title': 'Du lịch Sài Gòn: Cẩm nang từ A đến Z',
          'summary': 'Bookme.com giới thiệu Cẩm nang du lịch Sài Gòn đầy đủ và súc tích nhất, giới thiệu các điểm đến và món ăn ngon khi bạn có dịp du lịch tới “Hòn ngọc Viễn Đông”.',
          'modifiedBy': 'Vu vu vi',
          'modifiedAt': '12:48 19/10/2017',
          'image': {
            'src': '/statics/news/news_01.jpg',
            'alt': 'Du lịch Sài Gòn: Cẩm nang từ A đến Z'
          }
        }
      ]
    })
}
export default {
  async getLogo () {
    let logo = await getLogo()
    return logo
  },
  async getCover () {
    let cover = await getCover()
    return cover
  },
  async getTopHotels () {
    let hotels = await getTopHotels()
    return hotels
  },
  async getTopNews () {
    let news = await getTopNews()
    return news
  }
}
