import restify from 'restify'
import corsMiddleware from 'restify-cors-middleware'
import * as _ from 'lodash'
import console from 'chalk-console'
import validator from 'restify-joi-middleware'
import errors from 'restify-errors'
import mongoose from 'mongoose'
import NodeCache from 'node-cache'
import * as log from 'loglevel'
import Joi from 'joi'

import { PORT, MONGO_OPTIONS } from './configSys'
import loggerMiddleware from './loggerMiddleware'

import userRoute from './src/routes/user'
import productRoute from './src/routes/product'
Joi.objectId = require('joi-objectid')(Joi)

const _cache = new NodeCache({ stdTTL: 500, checkperiod: 30 })
require('console-group').install()

var server = restify.createServer({
  name: 'devfast-api',
  version: '0.0.1',
  formatters: {
    'application/json': function(req, res, payload) {
      // in formatters, body is the object passed to res.send() NOTE  read: https://github.com/restify/errors/pull/87
      if (payload instanceof Error) {
        const error = payload.body
        return JSON.stringify({
          code: _.get(error, 'code', 'InternalServer'),
          name: payload.name || 'Unknow',
          message: _.get(error, 'message', payload.message),
          ...payload.context
        })
      }
      // for everything else, stringify as normal
      return JSON.stringify(payload)
    }
  }
})

// MARK  global vairables
global._ = _
global.isDev = process.env.NODE_ENV !== 'production'
global._cache = _cache

// if (global.isDev) {
//   log.setLevel(0)
//   /* #region   document */
//   // log.info('info-----')
//   // log.debug('debug----')
//   // log.warn('log-----')
//   // log.error('error---')
//   // console.log(log.getLevel(), '----')
//   /* #endregion */
// }
/* MARK  Middleware  */
// server.use(loggerMiddleware)

const cors = corsMiddleware({
  origins: ['http://127.0.0.1', '*'], // defaults to ['*']
  methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST', 'OPTIONS'],
  // preflightMaxAge: 5, // Optional
  // allowHeaders: ['Authorization','Access-Control-Allow-Origin']
})


// server.pre(cors.preflight)
server.pre(restify.plugins.pre.dedupeSlashes())
server.pre(restify.plugins.pre.sanitizePath())
// server.use(cors.actual)
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.jsonp())
server.use(restify.plugins.gzipResponse())
server.use(restify.plugins.bodyParser())
/* #region  Hướng dẫn sử throttle */
// burst: Số lượng request đồng thời trong 1 giây
// rate : Số lượng request được phục hồi sau mỗi 1 giây
server.use(
  restify.plugins.throttle({
    burst: 2000,
    rate: 1000,
    ip: true
    // overrides: {
    //   '192.168.1.1': {
    //     rate: 0, // unlimited
    //     burst: 0
    //   }
    // }
  })
)
/* #endregion */

server.use(
  validator({
    joiOptions: {
      convert: true,
      allowUnknown: true,
      abortEarly: false
      // .. all additional joi options
    },
    // changes the request keys validated keysToValidate: ['params', 'body', 'query', 'user', 'headers', 'trailers',
    // 'files'], changes how joi errors are transformed to be returned - no error details are returned in this case
    errorTransformer: (validationInput, joiError) => {
      const tranformError = joiError.details.map(err => {
        const path = err.path.join('.')
        let item = {}
        item.type = err.type
        item.message = `${path} ${err.message}`
        return item
      })
      return new errors.InvalidArgumentError(
        {
          name: 'RouteValidation',
          info: {
            errors: tranformError
          }
        },
        'Validate route fail'
      )
    }
  })
)

// MARK  connect
console.green(`Connecting to mongo ${MONGO_OPTIONS.uri}`)

mongoose
  .connect(MONGO_OPTIONS.uri, {
   // user: MONGO_OPTIONS.user,
    //pass: MONGO_OPTIONS.pass,
    ...MONGO_OPTIONS.db_options
  })
  .catch(error => console.error(error))
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
const db = mongoose.connection

// MARK  Main
db.once('open', () => {
  console.yellow(`connected ${MONGO_OPTIONS.uri} succsesfull`)

  // NOTE  start
  server.listen(PORT, () => {
    console.blue(`Server is listening on port ${PORT}`)
    userRoute.applyRoutes(server, '/user')
    productRoute.applyRoutes(server, '/product')
  })
})
