import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import jsonServer from 'json-server'
import routes from './routes.js'

dotenv.config()

const options = {
  // If you want to serve a basic frontend, define the path in the 'static' option.
  // static: './path',
  logger: true,
  bodyParser: true,
  noCors: false,
  readOnly: false
}

const PORT = process.env.JSON_SERVER_PORT || 3000
const WRITE_TO_FILE = process.env.WRITE_TO_FILE || false
const server = jsonServer.create()
const router = jsonServer.router(routes.routes)
const middlewares = jsonServer.defaults(options)

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Writing changes to respective collections
if (WRITE_TO_FILE) {
  for (const route in routes.routes) {
    server.use((req, res, next) => {
      if (req._parsedUrl.pathname.includes(`/${route}`)) {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
          function afterResponse() {
            res.removeListener('finish', afterResponse)
            res.removeListener('close', afterResponse)

            // action after response
            const collectionFile = path.resolve(`src/db/${route}/data.json`)
            const data = JSON.stringify(router.db.getState()[route])

            fs.writeFile(collectionFile, data, 'utf8', (error) => {
              if (error) {
                console.log(error)
              }

              console.log(
                `data.json for collection '${route}' has been updated.`
              )
            })
          }

          res.on('finish', afterResponse)
          res.on('close', afterResponse)
        }
      }

      next()
    })
  }
}

for (const interceptor in routes.interceptors) {
  if (typeof routes?.interceptors[interceptor] === 'function') {
    server.use(routes?.interceptors[interceptor])
  }
}

for (const rewriter in routes.rewriters) {
  if (typeof routes?.rewriters[rewriter] === 'function') {
    server.use(routes?.rewriters[rewriter])
  }
}

server.use(router)

server.listen(PORT, () => {
  console.log(
    `JSON Server is running on port: ${PORT}.\nPress 'S' to save a snapshot of the database.`
  )
})
