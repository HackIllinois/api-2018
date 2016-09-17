var Bookshelf = require('Bookshelf');
var express = require('express');
var fs = require('fs');
var Mocha = require('mocha');

var ArgParse = require('argparse').ArgumentParser;
var parser = new ArgParse({
        version: 'pre-release 0.0.1',
        addHelp: true,
        description: 'HackIllinois 2017 API'
});

parser.addArgument(
        ['-t', '--test'],
        {
                action: 'storeTrue',
                help: 'Run tests.'
        }
);

var args = parser.parseArgs();

var config = require('./api/config');
var database = require('./api/database');
var logger = require('./api/logging');


// the dirname is local to every module, so we expose the app root's cwd
// here (before initializing the api)
config.cwd = process.__dirname;

var instance = express();
instance.disable('x-powered-by');

var api = require('./api/');
instance.use('/v1', api.v1);

var instance = instance.listen(config.port, function() {
        logger.info("initialized api (http://localhost:%d)", config.port);
});

module.exports = instance;

if(args.test)
{
        var mocha = new Mocha({
		bail: true,
		fullTrace: true
	});

        mocha.addFile('api/v1/test/test.js');
        mocha.run()
                .on('end', function() {
                        process.exit(0);
                });
}
else
{
	Bookshelf.events.off('superUserInitialized');
}
