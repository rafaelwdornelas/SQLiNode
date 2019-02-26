const LineByLineReader = require('line-by-line')
const api = require('./api')


lr = new LineByLineReader('linksparateste.txt');
lr.on('error', function (err) {
    // 'err' contains error object
});
 var travado =  true;
lr.on('line', async function (line) {
    lr.pause();
    await api.SQLItest(line.toLowerCase()).then(function(retorno) {
        console.log(retorno)
        lr.resume();
     })
     
     
});


lr.on('end', function () {
    console.log("Acabou lista")
}); 