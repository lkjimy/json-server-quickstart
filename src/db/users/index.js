import jsonServer from 'json-server'
import { readFile } from 'fs/promises'
const json = JSON.parse(await readFile(new URL('./data.json', import.meta.url)))

// Static data for this collection is loaded first.
const data = [...json]

// You can generate and insert some data on this collection here.
const ids = data.map((entry) => entry.id)

for (let index = 1; index < 3; index++) {
  function checkIds(id) {
    let currentId = id

    if (ids.includes(currentId)) {
      currentId++
      return checkIds(currentId)
    }

    return currentId
  }

  // finds an unused id
  const unusedId = checkIds(index)

  // adds to the list of used ids
  ids.push(unusedId)

  const date = new Date()

  // pushes the new user object to the dataset
  data.push({
    id: unusedId,
    name: `User ${index}`,
    plate: '#',
    car: [],
    createdAt: date.toUTCString()
  })
}

// Here you can setup your route.
export default {
  name: 'users',

  data: data,

  interceptor: (req, res, next) => {
    if (req._parsedUrl.pathname === '/users') {
      if (req.method === 'POST') {
        const date = new Date()
        req.body.createdAt = date.toUTCString()
      }
    }

    next()
  },

  rewriter: jsonServer.rewriter({
    // Custom route to get the user by number plate
    '/users/plate/:plate': '/users?plate=:plate'
  })
}
