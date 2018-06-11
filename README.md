# Mage2TS

*Mapping Magento 2 APIs to Typescript. Firebase ready.*

Mage2TS takes in the Swagger schema of a Magento 2 installation, cleans it up and generates a Typescript class with all the methods needed to interact with the REST endpoints.
Generated class can be uploaded to Firebase in order to use it within *Cloud Functions*.

## Installation

Simply run

```
npm install fabdan/mage2ts
```

Into your project's folder.

## Usage

After the install, you can run it using the following command:

```
mage2ts <host> -c <class name> -s <store code>
```

**Arguments**

- host: the base URL or IP address of your Magento instance

**Options**

- (-c | --class) name of the class that will be generated, default to 'Magento'
- (-s | --store) if you want to retrieve Swagger schema from a specific store, default to 'default'
- (-f | --firebase) if added, it will place the generated file into 'functions/src', default to 'src'
- (-t | --test) if added, it will parse Swagger schema without generating the Typescript class

## Thanks to
Special thanks to **wcandillon** and his [*swagger-js-codegen*](https://github.com/wcandillon/swagger-js-codegen), from which the idea was based.
