console.log('Hola mundo')

import fs from 'fs'
import path from 'path'
import prompt from 'prompt'
const co     = require('co')
const Heroku = require('heroku-client')
const hk     = new Heroku({ token: 'a786efc9-17a8-4653-a666-6de14df29b00' })

createApp('mi-librito')
prompt.start()


async function main () {
  let apps  = await hk.get('/apps')
  let dynos = await Promise.all(apps.map(getDynos))
  console.log(apps)
  console.log(dynos)

  function getDynos(app) {
    return hk.get(`/apps/${app.name}/dynos`)
  }
}

async function createApp (name) {
  let test
  try {
    test = await hk.post('/apps', {body: { name }})
  } catch(err) {
    console.log()
    throw new Error(err.body.message)
  }
  console.log(test)
}

async function ask (messsage) {
  return new Promise((resolve, reject) => {
    prompt.get({properties: {
      variable: {
        //TODO (SI DA TIEMPO): MACHEAR EL TITULO POR CARACTERES Y NUMEROS...
        messsage,
        required: true
      }
    }}, (err, result) => {
      if (err) return reject(err)
      resolve(result.variable)
    });
  })
}

export async function config () {
  let defaultConfig = {}
  try {
    defaultConfig = require(path.resolve(process.cwd(), 'book.json'))
  } catch(err) {}

  if(!defaultConfig.title) defaultConfig.title = await ask('Escribe el título del libro')
  if(!defaultConfig.path) defaultConfig.path = await ask('Escribe la ruta completa hasta la build del gitbook')

  defaultConfig.token = await ask('Introduce tu token de Heroku (https://dashboard.heroku.com/account)')
  return defaultConfig
}

export function start () {
  //TODO:
  /*
  1. Intentar hacer un heroku create
  2.
  3. si ya existe la aplicación lanzar un error de que ya existe la aplicación
  */
}

export function deploy (params) {
  if (!params.token) throw new Error('Necesito un token para poder desplegar la aplicación')
  if (!params.path) throw new Error('Necesito la dirección del gitbook construido')
  if (!params.nombreApp) throw new Error('Necesito el nombre de la App')

  //TODO:
  /*
  Paquete de git : const Git = require('simple-git')
  1. revisar que el directorio de construcción del gitbook (EJ: _book existe)
  2. si existe y tiene ficheros entonces copiarlo a una carpeta temporal (EJ: .deployHeroku)
  3. añadir un index.js, Procfile, etc con un miniservidor de express que sirva el index.html
  4. hacer un git init
    const Git = require('simple-git')
         function init(){
            Git.init()
         }
  5. git remote add heroku https://git.heroku.com/<nombre libro>.git
     function remote(remoto){
     .addRemote('heroku', remoto)
     }

  6. git push heroku master
  */
}