import axios from 'axios'
import storage from 'src/services/web-storage-service'

function addAuthorization (config) {
  if (config) {
    if (config.headers) {
      config.headers['Authorization'] = storage.local.get('token') ? storage.local.get('token') : ''
    }
    else {
      config['headers'] = {'Authorization': storage.local.get('token') ? storage.local.get('token') : ''}
    }
    return config
  }
  return {
    headers: {'Authorization': storage.local.get('token') ? storage.local.get('token') : ''}
  }
}
export default {
  request (config) {
    config = addAuthorization(config)
    config.url = process.env.BASE_URL + config.url
    return axios.request(config)
  },
  get (url, config) {
    config = addAuthorization(config)
    url = process.env.BASE_URL + url
    return axios.get(url, config)
  },
  delete (url, config) {
    config = addAuthorization(config)
    url = process.env.BASE_URL + url
    return axios.delete(url, config)
  },
  head (url, config) {
    config = addAuthorization(config)
    url = process.env.BASE_URL + url
    return axios.head(url, config)
  },
  options (url, config) {
    config = addAuthorization(config)
    url = process.env.BASE_URL + url
    return axios.head(url, config)
  },
  post (url, data, config) {
    config = addAuthorization(config)
    url = process.env.BASE_URL + url
    return axios.post(url, data, config)
  },
  put (url, data, config) {
    config = addAuthorization(config)
    url = process.env.BASE_URL + url
    return axios.put(url, data, config)
  },
  patch (url, data, config) {
    config = addAuthorization(config)
    url = process.env.BASE_URL + url
    return axios.patch(url, data, config)
  }
}
