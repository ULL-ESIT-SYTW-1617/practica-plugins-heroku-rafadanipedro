import fs from 'fs'
import path from 'path'
import Git from 'simple-git'
import ncp from 'ncp'

ncp.limit = Infinity

export default async function deploy (params) {
  if (!params.path) throw new Error('Necesito la dirección del gitbook construido')
  if (!params.nombreApp) throw new Error('Necesito el nombre de la App')

  let dirGitbook = path.resolve(process.cwd(), params.path)
  let tempDir = path.resolve(process.cwd(), '.heroku')

  console.log(`Tu gitbook está en ${dirGitbook}`)
  console.log(`Tu gitbook está en ${tempDir}`)

  if (!fs.existsSync(dirGitbook)) throw new Error('no existe el directorio del gitbook')
  if (fs.readdirSync(dirGitbook).length === 0) throw new Error('El directorio generado está vacio')

  await copyDir(dirGitbook, tempDir)
  copyServidor(tempDir)

  let gitPath = path.resolve(process.cwd(), '.heroku')
  console.log(gitPath)
  let git = Git(gitPath)
  await despliegueHeroku(git, params.nombreApp)
}

function copyDir (source, destination) {
  return new Promise((resolve, reject) => {
    ncp(source, destination, err => {
      if (err) return reject(err)
      resolve()
    });
  })
}

function despliegueHeroku (git, nombreApp) {
  console.log('Voy a hacer el DESPLIEGUE TOTALLLL')
  return new Promise((resolve,reject)=>{
    git.init()
      .addRemote('heroku',`https://git.heroku.com/${nombreApp}.git`)
      .add('.')
      .commit('Heroku push')
      .push(['-uf', 'heroku', 'master'], (err,data) => {
        if(err) return reject(err)
        resolve(data)
      })
  })
}

function copyServidor (rutaServidor) {
  let files = fs.readdirSync(path.resolve(__dirname, '../servidor'))

  for (let file of files) {
    console.log('Voy a copiar el fichero');
    console.log(file)
    console.log('En el directorio')
    console.log(rutaServidor)

    let rutaFicheroInicial = path.resolve(__dirname, '../servidor', file)
    let rutaFicheroFinal = path.resolve(rutaServidor, file)

    fs.writeFileSync(rutaFicheroFinal, fs.readFileSync(rutaFicheroInicial))
  }
}

