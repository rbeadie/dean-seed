var DocumentDBClient = require('documentdb').DocumentClient;
var docdb = require('./docdbUtils');
var jsondiff = require('jsondiffpatch').create();
// insert a new diff filter, right before "objects" one, to filter out system values
jsondiff.processor.pipes.diff.before('objects', objectPropertyTrimFilter);

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

		if (id == 0) {
			self.addItem(req,res);
		} else {
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
		}

    },

	addItem: function (req, res) {
		var self = this;
		var item = req.body;
		item['LastModified'] = Date.now();

		self.client.createDocument(self.collection._self, item, function (err, doc) {
			if (err) {
				 res.json(false);
			} else {
				res.json({
							item: doc
						});
			}           
		  });        
	},

	updateItem: function (req, res) {
		var self = this;
		var id = req.params.id;
		var newitem = req.body;

		if (id == 0) {
			self.addItem(req,res);
		} else {
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
						
								var delta = jsondiff.diff(item, newitem);

								if (delta){
									// do something with the delta
								}

								self.client.replaceDocument(item._self, newitem, function(err, replaced){
											if (err) {
												res.json(false);
											} else {
												res.json(true);                
											} 
										});
								}
						});
		}
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


// used to exclude system values from documents for diff: LastModified, LastModifiedBy, NarrativeCompleteness, _etag, _ts
function trimObject(obj) {
  trimmedObject = {};
  for (var name in obj) {
	if (name.slice(0, 1) !== '_' && name.slice(0,12) != 'LastModified') {
	  trimmedObject[name] = obj[name];
	}
  }
  return trimmedObject;
}

function objectPropertyTrimFilter(context) {
  if (!context.leftIsArray && context.leftType === 'object') {
	// replace context left object with trimmed version
	context.left = trimObject(context.left);
  }
  if (!context.rightIsArray && context.rightType === 'object') {
	// replace context right object with trimmed version
	context.right = trimObject(context.right);
  }
}