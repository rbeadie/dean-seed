var config = {}

config.port = '3000';

config.db = {
	host: process.env.HOST || "[documentdb host]",
	authKey: process.env.AUTH_KEY || "[documentdb key]",
	databaseId: "[database name]",
 	collectionId: "[collection name]"
};

config.app = {
    title: 'App title',
    description: 'built on DocumentDB, Express, AngularJS and Node',
  	logo: 'public/images/logo.png',
  	favicon: 'public/images/favicon.ico'
};

module.exports = config;

    
