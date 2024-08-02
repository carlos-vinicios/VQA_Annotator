import axios from "axios";
import { signOut, setAuthDataCookie } from "@/services/auth";
import { decodeAuthData } from "@/services/jwt";

let isRefreshing = false
let faileruRequest = []

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
})

api.interceptors.response.use((response) => {
  return response
}, async (err) => {
  if(err.response?.status === 401) {
    // se tiver refreshToken nos cookies, recupero aqui
    const jwtDecode = await decodeAuthData('systems')
    const requestConfig = err.config

    // essa estrategia é utilizada para que o codigo de refreshToken seja executado somente na primeira ver em que houver um erro
    if(!isRefreshing && jwtDecode) {
      isRefreshing = true
      const { refresh_token, email } = jwtDecode
      
      // faço uma requeset para a rota de refreshToken enviando o refreshToken
      api.post('/refresh_token', null, {
        headers: {
          'Authorization': `Bearer ${refresh_token}`
        }
      })
      .then(response => {
        // com a response de token e refreshToken atualizados, recupero-os aqui
        const { access_token, stage } = response.data
        
        setAuthDataCookie({
          email,
          stage,
          access_token,
          refresh_token: jwtDecode.refresh_token
        })

        // atualizo o header default com o novo token
        api.defaults.headers['Authorization'] = `Bearer ${access_token}`

        faileruRequest.forEach(request => request.onSuccess(access_token))
        faileruRequest = []
      })
      .catch(err => {
        faileruRequest.forEach(request => request.onFailure(err))
        faileruRequest = []
      })
      .finally(() => {
        isRefreshing = false
      })
    }

    return new Promise((resolve, reject) => {
      faileruRequest.push({
        // caso uma requisição falhe, vou refaze-la com o novo token
        onSuccess: (token) => {
          requestConfig.headers['Authorization'] = `Bearer ${token}`

          resolve(api(requestConfig))
        },
        // caso falhe com o novo token, somente rejeito
        onFailure: (err) => {
          reject(err)
        }
      })
    })
  } else if(err.response.status === 422 || err.response.status === 400 || err.response.status === 404) {
    return Promise.reject(err);
  } else {
    signOut()
  }

  return Promise.reject(err)
})

export { api }