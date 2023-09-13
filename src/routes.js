import users from './db/users/index.js'
import cars from './db/cars/index.js'
import brands from './db/brands/index.js'

export default {
  routes: {
    [users.name]: users.data,
    [cars.name]: cars.data,
    [brands.name]: brands.data
  },

  interceptors: {
    [users.name]: users.interceptor,
    [cars.name]: cars.interceptor,
    [brands.name]: brands.interceptor
  },

  rewriters: {
    [users.name]: users.rewriter,
    [cars.name]: cars.rewriter,
    [brands.name]: brands.rewriter
  }
}
