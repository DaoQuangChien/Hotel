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

function getListHotel () {
  return http.get('/content/listHotel')
    .then(res => res.data)
    .catch(error => {
      console.debug(error)
      return {
        selectOpt: [
          {
            label: 'Hồ Chí Minh',
            value: 'HCM'
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
            label: 'Qui Nhơn',
            value: 'QN'
          },
          {
            label: 'Cần Thơ',
            value: 'CT'
          },
          {
            label: 'Nha Trang',
            value: 'NT'
          }
        ],
        list: [
          {
            'id': 1,
            'name': 'Bitesco',
            'location': 'Hồ Chí Minh',
            'value': 'HCM',
            'standard': 4.9,
            'rated': 4,
            'lowestPrice': '300000',
            'highestPrice': '10000000',
            'roomQuantity': 35
          },
          {
            'id': 2,
            'name': 'Mường Thanh',
            'location': 'Cần Thơ',
            'value': 'CT',
            'standard': 4,
            'rated': 6.9,
            'lowestPrice': '1000000',
            'highestPrice': '20000000',
            'roomQuantity': 300
          },
          {
            'id': 3,
            'name': 'Green House',
            'location': 'Đà Nẵng',
            'value': 'DN',
            'standard': 3,
            'rated': 7.9,
            'lowestPrice': '3000000',
            'highestPrice': '5000000',
            'roomQuantity': 45
          },
          {
            'id': 4,
            'name': 'Bitescoooo',
            'location': 'Hà Nội',
            'value': 'HN',
            'standard': 4.9,
            'rated': 5,
            'lowestPrice': '3000000',
            'highestPrice': '10000000',
            'roomQuantity': 55
          },
          {
            'id': 5,
            'name': 'Mường Thanh',
            'location': 'Đà Nẵng',
            'value': 'DN',
            'standard': 4,
            'rated': 6.9,
            'lowestPrice': '1000000',
            'highestPrice': '20000000',
            'roomQuantity': 300
          },
          {
            'id': 6,
            'name': 'Green House',
            'location': 'Đà Nẵng',
            'value': 'DN',
            'standard': 7,
            'rated': 7.9,
            'lowestPrice': '3000000',
            'highestPrice': '5000000',
            'roomQuantity': 45
          },
          {
            'id': 7,
            'name': 'Bitesco',
            'location': 'Hồ Chí Minh',
            'value': 'HCM',
            'standard': 4.9,
            'rated': 4,
            'lowestPrice': '300000',
            'highestPrice': '10000000',
            'roomQuantity': 35
          },
          {
            'id': 8,
            'name': 'Mường Thanh',
            'location': 'Nha Trang',
            'value': 'NT',
            'standard': 4,
            'rated': 6.9,
            'lowestPrice': '1000000',
            'highestPrice': '20000000',
            'roomQuantity': 300
          },
          {
            'id': 9,
            'name': 'Green House',
            'location': 'Qui Nhơn',
            'value': 'QN',
            'standard': 3,
            'rated': 7.9,
            'lowestPrice': '3000000',
            'highestPrice': '5000000',
            'roomQuantity': 45
          },
          {
            'id': 10,
            'name': 'Bitesco',
            'location': 'Hồ Chí Minh',
            'value': 'HCM',
            'standard': 4.9,
            'rated': 4,
            'lowestPrice': '300000',
            'highestPrice': '10000000',
            'roomQuantity': 35
          },
          {
            'id': 11,
            'name': 'Mường Thanh',
            'location': 'Cần Thơ',
            'value': 'CT',
            'standard': 4,
            'rated': 6.9,
            'lowestPrice': '1000000',
            'highestPrice': '20000000',
            'roomQuantity': 300
          },
          {
            'id': 12,
            'name': 'Green House',
            'location': 'Đà Nẵng',
            'value': 'DN',
            'standard': 3,
            'rated': 7.9,
            'lowestPrice': '3000000',
            'highestPrice': '5000000',
            'roomQuantity': 45
          },
          {
            'id': 13,
            'name': 'Bitesco',
            'location': 'Hồ Chí Minh',
            'value': 'HCM',
            'standard': 4.9,
            'rated': 4,
            'lowestPrice': '300000',
            'highestPrice': '10000000',
            'roomQuantity': 35
          },
          {
            'id': 14,
            'name': 'Mường Thanh',
            'location': 'Cần Thơ',
            'value': 'CT',
            'standard': 4,
            'rated': 6.9,
            'lowestPrice': '1000000',
            'highestPrice': '20000000',
            'roomQuantity': 300
          },
          {
            'id': 15,
            'name': 'Green House',
            'location': 'Đà Nẵng',
            'value': 'DN',
            'standard': 3,
            'rated': 7.9,
            'lowestPrice': '3000000',
            'highestPrice': '5000000',
            'roomQuantity': 45
          }
        ]
      }
    })
}

function getListRoom () {
  return http.get('/content/listRoom')
    .then(res => res.data)
    .catch(error => {
      console.debug(error)
      return {
        selectOpt: [
          {
            label: 'Event',
            value: 'event'
          },
          {
            label: 'Loại',
            value: 'type'
          },
          {
            label: 'Tiện ích',
            value: 'facility'
          }
        ],
        list: [
          {
            id: 1,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 2,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 3,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 4,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 5,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 6,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 7,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 8,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 9,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          },
          {
            id: 10,
            name: 'The King Room',
            kind: '1 giường',
            facility: 'Wifi, Máy lạnh, TV, Ghế dài',
            description: 'Diện tích khoảng 90m2, hướng rừng nhiệt đới. Tối đa 2 người lớn, kê được giường phụ. \nDiện tích 90m2 Hướng rừng nhiệt đới.',
            price: '1,000,000 VND',
            quantity: '50 phòng',
            image: '/statics/hotels/hotel_01.png'
          }
        ]
      }
    })
}

function getEventPrice () {
  return http.get('/content/listEventPrice')
    .then(res => res.data)
    .catch(error => {
      console.debug(error)
      return [
        {
          from: '7/1/2017',
          to: '8/30/2017',
          event: {
            description: 'Giảm 40%',
            apply: 'all'
          },
          price: {
            description: 'Giá tiền tăng 500.000VND',
            apply: 'all'
          }
        },
        {
          from: '11/8/2017',
          to: '12/30/2017',
          event: {
            description: 'Giảm 50%',
            apply: 'all'
          },
          price: {
            description: 'Giá tiền tăng 50%',
            apply: 'The King Room, The Queen Room'
          }
        },
        {
          from: '7/1/2017',
          to: '8/30/2017',
          event: {
            description: 'Giảm 30%',
            apply: 'The King Room, The Queen Room'
          },
          price: {
            description: 'Giá tiền tăng 500.000VND',
            apply: 'all'
          }
        },
        {
          from: '11/8/2017',
          to: '12/30/2017',
          event: {
            description: 'Giảm 50%',
            apply: 'The King Room, Pleb Room'
          },
          price: {
            description: 'Giá tiền tăng 50%',
            apply: 'The King Room, Peasant Room'
          }
        },
        {
          from: '7/1/2017',
          to: '8/30/2017',
          event: {
            description: 'Giảm 50%',
            apply: 'all'
          },
          price: {
            description: 'Giá tiền tăng 500.000VND',
            apply: 'Pleb Room, Peasant Room'
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
  },
  async getListHotel () {
    let listHotel = await getListHotel()
    return listHotel
  },
  async getListRoom () {
    let listRoom = await getListRoom()
    return listRoom
  },
  async getEventPrice () {
    let listEventPrice = await getEventPrice()
    return listEventPrice
  }
}
