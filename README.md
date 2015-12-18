# DocumentDB - Express - AngularJS - Node (DEAN) Seed

DEAN stack seed project, based on the [Angular Express Seed](https://github.com/btford/angular-express-seed)

## How to use angular-express-seed

Clone the repository, then run:

npm install

bower install

gulp

### Running the app

Type:

    npm start

### Receiving updates from upstream

Just fetch the changes and merge them into your project with git.


## Directory Layout
    
    app.js              --> app start
    bower.json          --> bower package list
    gulpfile.js         --> gulp start
    package.json        --> npm package list
    bower_components    --> bower install location
    modules/            --> modules used for interacting with database
      app.js            --> app config
      config.js         --> config variables
      docdbdao.js       --> DAO functions for accessing DocumentDB
      dobdbutils.js     --> DocumentDB connection utils
      server.js         --> start file called by app start
    public/             --> all of the files to be used in on the client side
      app/               --> javascript files
        app.js          --> declare top-level app module
        controllers.js  --> application controllers
        directives.js   --> custom angular directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
      css/              --> css files
        app.css         --> default stylesheet
      images/           --> image files
      lib/              --> destination folder for gulp build components
        third-party.css --> built by gulp
        third-party.js  --> built by gulp
        webapp.css      --> built by gulp
        webapp.js       --> built by gulp
    routes/
      index.js          --> route for serving HTML pages and partials
    views/
      index.jade        --> main page for app
      layout.jade       --> doctype, title, head boilerplate
      partials/         --> angular view partials (partial jade templates)
        addItem.jade
        deleteItem.jade
        editItem.jade
        index.jade
        readItem.jade


## License
MIT
