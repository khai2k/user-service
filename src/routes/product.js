import Joi from 'joi'
Joi.objectId = require('joi-objectid')(Joi)

import restifyRouter from 'restify-router'
import productDao from '../dao/product'

const Router = restifyRouter.Router
const productRoute = new Router()

// Read all user
productRoute.get('', async (req, res) => {
  try {
    let result = await productDao.readallUser()
    res.send(result)
  } catch (error) {
    console.log(error, 'errorerror')
    return res.send(error.message)
  }
})
// Read user
productRoute.get(
  {
    path: '/:id',
    validation: {
      schema: Joi.object().keys({
        params: Joi.object()
          .keys({
            id: Joi.objectId().required()
          })
          .required()
      })
    }
  },
  async (req, res) => {
    let query = req.params.id
    let result = await productDao.readUser(query)
    res.send(result)
  }
)

// Delete user
productRoute.del(
  {
    path: '/:id',
    validation: {
      schema: Joi.object().keys({
        params: Joi.object()
          .keys({
            id: Joi.objectId().required()
          })
          .required()
      })
    }
  },
  async (req, res) => {
    let query = req.params.id
    await productDao.deleteUser(query)
    res.send(200)
  }
)

//Update user
productRoute.put(
  {
    path: '/:id',
    validation: {
      schema: Joi.object().keys({
        body: Joi.object()
          .keys({
            brand: Joi.string().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
            image: Joi.string().required(),
            countInStock: Joi.number().required()
          })
          .required(),
        params: Joi.object()
          .keys({
            id: Joi.objectId().required()
          })
          .required()
      })
    }
  },
  async (req, res) => {
    let data = req.body
    let query = req.params.id
    await productDao.updateUser(data, query)
    res.send(200)
  }
)

//create
productRoute.post(
  {
    path: '',
    validation: {
      schema: Joi.object().keys({
        body: Joi.object()
          .keys({
            brand: Joi.string().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
            image: Joi.string().required(),
            countInStock: Joi.number().required()
          })
          .required()
      })
    }
  },
  async (req, res, next) => {
    try {
      const { brand, price, name, image, countInStock } = req.body
      let result = await productDao.createUser({ brand, price, name, image, countInStock })
      //   console.log(result, 'resultresultresultresult')
      res.send({ data: result })
    } catch (error) {
      res.send(error)
    }
  }
)

export default productRoute
