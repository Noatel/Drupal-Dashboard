import axios from 'axios'

require('dotenv').config()

export const baseURL = process.env.REACT_APP_API_URL;
export default axios.create({
  baseURL: baseURL,
  timeout: 1000,
})
