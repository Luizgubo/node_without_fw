let environments = {}


environments.staging = {
    'httpPort' : 3000,
    'httpsPort': 3001,
    'envName'  : 'staging'
}

environments.production = {
    'httpPort' : 5000,
    'httpsPort': 5001,
    'envName'  : 'production'
}


let currentEnvrironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


let environmentToExport = typeof(environments[currentEnvrironment]) == 'object' ? environments[currentEnvrironment] : environments.staging;


module.exports = environmentToExport;