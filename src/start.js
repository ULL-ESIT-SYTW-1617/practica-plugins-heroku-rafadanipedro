import Heroku from 'heroku-client'
import fs from 'fs'

export default async function start (config = {}) {
  console.log('Me pasas esta config al start')
  console.log(config)
  if (!config.nombreApp) throw new Error('Tienes que pasarme el nombre de la App para poder crearla')
  if (!config.token) throw new Error('Tienes que pasarme la ruta del token')

  let token
  try {
    token = fs.readFileSync(config.token).toString()
  } catch(err) {
    console.log(err)
    throw new Error(`La ruta hasta el token no es la correcta ${config.token}`)
  }

  createApp(config.nombreApp, token)
}

async function createApp (name, token) {
  const hk = new Heroku({ token })

  let body
  try {
    body = await hk.post('/apps', {body: { name }})
  } catch(err) {
    console.log()
    throw new Error(err.body.message)
  }
  console.log(`Desplegado en ${body.web_url}`)
}