// Getting the main class
var Mage2TS = require('./lib/tools.js').Mage2TS;
var commander = require('commander');

commander
    .version('0.1.7', '-v, --version')
    .description('Converts Magento\'s Swagger schema into a Typescript class. Firebase ready.')
    .command('mage2ts')
    .arguments('<host>')
    .option('-s, --store <string>', 'the store code from which to gain the Swagger scheme (default to "default")')
    .option('-c, --class <string>', 'name of the generated Typescript class (default to "Magento")')
    .option('-f, --firebase', 'if added, the generated class will be put under src/functions (default to "src")')
    .option('-t, --test', 'if added, Swagger schema will be processed but no class is generated')
    .action(function(host) {
        Mage2TS.init(host, commander.store, commander.class, commander.firebase, commander.test);
    })
    .parse(process.argv);