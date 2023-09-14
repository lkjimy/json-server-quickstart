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
const server = jsonServer.create()
const router = jsonServer.router(routes.routes)
const middlewares = jsonServer.defaults(options)

server.use(middlewares)
server.use(jsonServer.bodyParser)

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
