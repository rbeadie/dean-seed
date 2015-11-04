var DocumentDBClient = require('documentdb').DocumentClient;
var docdb = require('./docdbUtils');

function DocDBDao(docdbClient, databaseId, collectionId) {
  this.client = docdbClient;
  this.databaseId = databaseId;
  this.collectionId = collectionId;

  this.database = null;
  this.collection = null;
  this.documents = null;
}

module.exports = DocDBDao;

DocDBDao.prototype = {
    init: function (callback) {
        var self = this;
        console.log('docdbdao init');

        docdb.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
            if (err) {
                callback(err);

            } else {
                self.database = db;
                docdb.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                    if (err) {
                        callback(err);

                    } else {
                        self.collection = coll;
                    }
                });
            }
        });
    },

    getItems: function (req, res) {
        var self = this;

        var querySpec = {
                        query: 'SELECT * FROM root r '
                };

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err,results){
                if (err) {
                         res.json(false);
                    } else {        
                            res.json({
                                        items: results
                                      });
                            }
                    });
    },

    getItem: function (req, res) {
        var self = this;
        var id = req.params.id;

        var querySpec = {
                    query: 'SELECT * FROM root r WHERE r.id=@id',
                    parameters: [{
                            name: '@id',
                            value: id
                    }]
            };             

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err,results){
                if (err) {
                         res.json(false);
                    } else {        
                            res.json({
                                        item: results[0]
                                      });
                            }
                    });

    },

    addItem: function (req, res) {
        var self = this;
        var item = req.body;

        self.client.createDocument(self.collection._self, item, function (err, doc) {
            if (err) {
                res.json(false);
            } else {
                res.json(doc);
            }           
          });        
    },

    updateItem: function (req, res) {
        var self = this;
        var id = req.params.id;

        var querySpec = {
                    query: 'SELECT * FROM root r WHERE r.id=@id',
                    parameters: [{
                            name: '@id',
                            value: id
                    }]
            };             

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err,results){
                if (err) {
                         res.json(false);
                    } else {
                            var item = results[0];

                            self.client.replaceDocument(item._self, req.body, function(err, replaced){
                                        if (err) {
                                            res.json(false);
                                        } else {
                                            res.json(true);                
                                        } 
                                    });
                            }
                    });
          
    },

    deleteItem: function (req, res) {
        var self = this;
        var id = req.params.id;

        var querySpec = {
                    query: 'SELECT * FROM root r WHERE r.id=@id',
                    parameters: [{
                            name: '@id',
                            value: id
                    }]
            };             

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err,results){
                if (err) {
                         res.json(false);
                    } else {
                            var item = results[0];

                            self.client.deleteDocument(item._self, function(err, replaced){
                                        if (err) {
                                            res.json(false);
                                        } else {
                                            res.json(true);                
                                        } 
                                    });
                            }
                    });
    }
};