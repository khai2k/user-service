import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import Joi from 'joi'
Joi.objectId = require('joi-objectid')(Joi)

import restifyRouter from 'restify-router'
import userDao from '../dao/user'
import user from '../models/user'

const Router = restifyRouter.Router
const userRoute = new Router()

// Read all user
userRoute.post("/signin",
  async(req,res)=>{
    const {name,password}= req.body;
    console.log(req.body)
    jwt.sign({user:req.body},'secretkey',(err,token)=>{
      res.json({
        token
      })
    })
  }
)
userRoute.get("",

  async (req,res)=>{
    let result = await userDao.readallUser();
    res.send(result);
  }
),
// Read user
userRoute.get(
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
    let result = await userDao.readUser(query)
    res.send(result)
  }
)

// Delete user
userRoute.del(
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
    await userDao.deleteUser(query)
    res.send(200)
  }
)

//Update user
userRoute.put(
  {
    path: '/:id',
    validation: {
      schema: Joi.object().keys({
        body: Joi.object()
          .keys({
            email: Joi.string().required(),
            name: Joi.string().required(),
            password: Joi.string().required()
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
    await userDao.updateUser(data, query)
    res.send(200)
  }
)

//create
userRoute.post(
  {
    path: '',
    validation: {
      schema: Joi.object().keys({
        body: Joi.object()
          .keys({
            email: Joi.string().required(),
            name: Joi.string().required(),
            password: Joi.string().required()
          })
          .required()
      })
    }
  },
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body
      let result = await userDao.createUser({ email, password, name })
      //   console.log(result, 'resultresultresultresult')
      res.send({ data: result })
    } catch (error) {
      res.send(error)
    }
  }
)

export default userRoute
