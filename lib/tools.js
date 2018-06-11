var Mage2TS = {

    // Data attributes
    data: {
        host: null,
        store: 'default',
        schemaUri: '/rest/{store}/schema',
        secure: false,
        class: 'Magento',
        schema: null,
        firebase: false,
        test: false
    },

    // Normalization + process starts
    init: function(host, store, className, firebase, test) {

        this.data.host = host;
        if (store) this.data.store = store;
        if (className) this.data.class = className;
        this.data.firebase = !!firebase;
        this.data.test = !!test;
        this.data.schemaUri = this.data.schemaUri.replace('{store}', this.data.store);
        this.data.secure = (this.data.host.match(/(https){1}/) != null);

        this.getSwaggerSchema();
    },

    // Cleans properties from bad chars which would disrupt the .ts class
    nestedPropsCleanUp: function(haystackObj, needleProp) {
        var r = null;
        if (haystackObj instanceof Array) {
            for (var i = 0; i < haystackObj.length; i++) {
                this.nestedPropsCleanUp(haystackObj[i], needleProp);
            }
        } else {
            for (var prop in haystackObj) {
                if (prop == needleProp) {
                    haystackObj[prop] = haystackObj[prop].replace(/-/g, '_');
                } else if (haystackObj[prop] instanceof Object || haystackObj[prop] instanceof Array) {
                    this.nestedPropsCleanUp(haystackObj[prop], needleProp);
                }
            }
        }
        return r;
    },

    // Calls Magento to retrieve Swagger's JSON schema
    getSwaggerSchema: function() {
        var transfer = this.data.secure ? require('https') : require('http');
        var url = this.data.host + this.data.schemaUri;
        var rawData = [];
        var rawJson;

        console.log("Host " + this.data.host + ' being called...');

        // Partial data being loaded in an Array, performance tweak
        var request = transfer.get(url, function(response) {
            response
                .on('data', function(v) {
                    rawData.push(v);
                })
                .on('end', function() {
                    console.log("Host " + Mage2TS.data.host + ' responded correctly!');
                    Mage2TS.processSwaggerSchema(rawData);
                });
        });
        request.on('error', function(exception) {
            console.log("There has been an error connecting to host: " + exception);
        });
    },

    // Actual process of parsing, cleaning and writing to file
    processSwaggerSchema: function(rawData) {
        // Parsing JSON
        try {
            this.data.schema = JSON.parse(rawData.join('').toString());
        } catch (exception) {
            return console.log("There has been an error while parsing host response: " + exception);
        }

        console.log('Swagger schema is being processed... (it may take some time)');

        // forEach is too slow
        for (oldIndex in this.data.schema.definitions) {
            newIndex = oldIndex.replace(/-/g, '_');
            this.data.schema.definitions[newIndex] = this.data.schema.definitions[oldIndex];
            delete this.data.schema.definitions[oldIndex];
        }

        // Cleaning up properties with '-' char, which will break apart the .ts file
        this.nestedPropsCleanUp(this.data.schema, "$ref");

        try {
            // Generating code using 'swagger-js-codegen'
            var tsSourceCode = require('swagger-js-codegen').CodeGen.getTypescriptCode({
                className: this.data.class,
                swagger: this.data.schema,
                lint: true
            });
        } catch (exception) {
            return console.log('There has been an error while parsing Swagger schema: ' + exception);
        }

        if (this.data.test) {
            console.log('Swagger schema parsed correctly! No class has been generated.');
        } else {
            // Writing new class
            var path;
            var fs = require('fs');
            if (this.data.firebase) {

                if (!fs.existsSync('functions')) {
                    fs.mkdirSync('functions');
                }

                if (!fs.existsSync('functions/src')) {
                    fs.mkdirSync('functions/src');
                }

                path = 'functions/src';
            } else {

                if (!fs.existsSync('src')) {
                    fs.mkdirSync('src');
                }

                path = 'src';
            }

            fs.writeFile(path + "/" + this.data.class + ".ts", tsSourceCode, function(exception) {
                if (exception)
                    return console.log("There has been an error while processing the schema: " + exception);

                console.log("Class " + Mage2TS.data.class + " has been generated!");
            });
        }
    }
};

module.exports = { Mage2TS };