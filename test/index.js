import * as pluginHeroku from '../src'

console.log(Object.keys(pluginHeroku))
/*
pluginHeroku.config()
  .then(config => {
      console.log(config)
      pluginHeroku.start(config)
        .then(console.log)
        .catch(console.error)
  })
*/

let config = { title: 'Tareas iniciales',
  path: '/home/ubuntu/workspace/pruebas/Pruebecita/gh-pages',
  token: 'a786efc9-17a8-4653-a666-6de14df29b00',
  nombreApp: 'tareas-iniciales' }

pluginHeroku.deploy(config)
  .then(console.log)
  .catch(console.error)
