import path from 'path'
import prompt from 'prompt'

export default async function config () {
  prompt.start()

  let defaultConfig = {}
  try {
    defaultConfig.title = require(path.resolve(process.cwd(), 'book.json')).title
  } catch(err) {}

  if(!defaultConfig.title) defaultConfig.title = await ask('Escribe el título del libro')
  if(!defaultConfig.path) defaultConfig.path = await ask('Escribe la ruta completa hasta la build del gitbook')

  defaultConfig.token = await ask('Introduce tu token de Heroku (https://dashboard.heroku.com/account)')
  defaultConfig.nombreApp = normalizarNombre(defaultConfig.title)
  console.log('La config final es')
  console.log(defaultConfig)
  return defaultConfig
}

function ask (messsage) {
  console.log(messsage)
  return new Promise((resolve, reject) => {
    prompt.get({properties: {
      variable: {
        //TODO (SI DA TIEMPO): MACHEAR EL TITULO POR CARACTERES Y NUMEROS...
        messsage: messsage,
        required: true
      }
    }}, (err, result) => {
      if (err) return reject(err)
      resolve(result.variable)
    });
  })
}

function normalizarNombre (nombre) {
  return nombre.replace(/([A-Z]+)/g, '-$1')
               .replace(/[A-Z]/g, c => c.toLowerCase())
               .replace(/\s/g, '-')
               .replace(/^-(.+)/, '$1')
}
