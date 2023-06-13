import axios from 'axios'


export const createInfo = async (data:any) => {

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/meeting/create',
        data:data
      }

    await axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data))
    })
    .catch((error) => {
        console.log(error)
    })
}