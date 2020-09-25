import axios from "axios"
// import { URL } from "../configSys"

export const createStatus = async ({ name, userId }) => {
    const { data } = await axios.post("http://localhost:3003/createStatusForUser", { name, userId })

    return data;
}
