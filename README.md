# SQLiNode
Sql Injetion Automatic in Node.js

Exemplo de uso.
const api = require('./api')

api.SQLItest("http://www.site.com/pagina.php?id=3").then(function(retorno) {
      console.log(retorno)
      assert.deepEqual(retorno, resulttemp)
})
