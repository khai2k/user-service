import UserModel from '../models/user'
import bcrypt from 'bcryptjs'
import { createStatus } from "../api/api"

const user = {
  async createUser({ email, name, password }) {
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(password, salt)
    let result = await UserModel.create({
      email,
      name,
      password: hash
    })

    await createStatus({ name, userId: result._id })
    return result

  },
  async signin(email, password) {
    let result = await UserModel.findOne({ email: email })
    if (result) {
      const resul = await bcrypt.compare(password, result.password)
      if (resul) return result;

      // let ff = await bcrypt.compare(password, result.paasword)
      // console.log(ff,"rffffftresult")
      // if (ff) return result;
    }
    return;
  },
  async readUser(query) {
    let result = await UserModel.findById(query)
    return result
  },
  async readallUser() {
    let result = await UserModel.find({})
    return result
  },
  async updateUser(data, query) {
    let result = await UserModel.findOneAndUpdate({ _id: query }, data)
  },
  async deleteUser(query) {
    let result = await UserModel.findOneAndRemove({ _id: query })
  }
}

export default user
