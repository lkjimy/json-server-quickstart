import { readFile } from 'fs/promises'
const json = JSON.parse(await readFile(new URL('./data.json', import.meta.url)))

// Static data for this collection is loaded first.
const data = [...json]

// You can generate and insert some data on this collection here.
// ...

// Here you can setup your route.
export default {
  name: 'brands',

  data: data,

  interceptor: (req, res, next) => {
    if (req._parsedUrl.pathname === '/brands') {
      if (req.method === 'POST') {
        const date = new Date()
        req.body.createdAt = date.toUTCString()
      }
    }

    next()
  },

  rewriter: null
}
