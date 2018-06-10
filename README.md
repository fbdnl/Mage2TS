# Mage2TS

*Mapping Magento 2 APIs to Typescript. Firebase ready.*

Mage2TS takes in the Swagger schema of a Magento 2 installation, cleans it up and generates a Typescript class with all the methods needed to interact with the REST endpoints.

## Installation

Simply run

```
npm install fabdan/mage2ts
```

Into your project's folder.

## Usage

After the install, you can run it using the following command:

```
mage2ts --host=http://192.168.1.1 --class=Magento --firebase=true --store=default
```

All the variables are as following:

```
*host*: the website/IP address of your Magento instance
*class*: classname you want to use (default to 'Magento')
*firebase*: if true, it will place the generated file into 'functions/src'; if false, it will place it into 'src'
*store*: if you want to retrieve Swagger schema from a specific store (default to 'default')
```

## Thanks to
Special thanks to **wcandillon** and his *swagger-js-codegen*, from which the idea was based.
