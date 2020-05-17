import UserModel from '../models/user'
const user = {
    async createUser(data) {
        let result = await UserModel.create(data)
        return result
    },
    async readUser(query) {
        let result = await UserModel.findById(query)
        return result
    },
    async updateUser(data, query) {
        let result = await UserModel.findOneAndUpdate(
            { _id: query },
            data
        )
    },
    async deleteUser(query) {
        let result = await UserModel.findOneAndRemove(
            { _id: query }
        )
    }
}
export default user