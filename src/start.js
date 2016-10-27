import Heroku from 'heroku-client'

export default async function start (config = {}) {
  if (!config.nombreApp) throw new Error('Tienes que pasarme el nombre de la App para poder crearla')
  if (!config.token) throw new Error('Tienes que pasarme el token para poder crear la App')

  createApp(config.nombreApp, config.token)
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