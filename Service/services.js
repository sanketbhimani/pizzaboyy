var restify = require('restify');

var async = require('async');
var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/PIZZABOYY';

function place_order(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var cheeses = req.query.cheeses;
    var toppings = req.query.toppings;
    var sauces = req.query.sauces;
    var crust = req.query.crust;
    var size = req.query.size;
    var comment = req.query.comment;
    var name = req.query.name;
    var address = req.query.address;
    var city = req.query.city;
    var pincode = req.query.pincode;
    var phone_number = req.query.phone_number;
    var total_price = req.query.total_price;
    var date_time = req.query.date_time;
    var statuss = req.query.status;
    var cnt_c = 0;
    var flg_c = true;
    var cost_c = 0;
    var cost_s = 0;
    var costc = 0;
    var costt = 0;
    var costs = 0;
    cheeses.forEach(function(each) {
        MongoClient.connect(url, function(err, db) {
            db.collection("cheeses", function(err, collection) {
                collection.find({ 'type': each }).toArray(function(err, items) {
                    if (err) {
                        console.log("error " + each);
                    }
                    console.log("match " + items.length + " " + each);
                    cnt_c += 1;
                    if (items.length > 0) {
                        costc += parseInt(items[0].cost, 10);
                        if (cheeses.length <= cnt_c && flg_c) {
                            var cnt_t = 0;
                            var flg_t = true;
                            toppings.forEach(function(each) {
                                db.collection("toppings", function(err, collection) {
                                    collection.find({ 'type': each }).toArray(function(err, items) {
                                        cnt_t += 1;
                                        if (items.length > 0) {
                                            costt += parseInt(items[0].cost, 10);
                                            if (toppings.length <= cnt_t && flg_t) {
                                                var cnt_s = 0;
                                                var flg_s = true;
                                                sauces.forEach(function(each) {
                                                    db.collection("sauces", function(err, collection) {
                                                        collection.find({ 'type': each }).toArray(function(err, items) {
                                                            cnt_s += 1;
                                                            if (items.length > 0) {
                                                                costs += parseInt(items[0].cost, 10);
                                                                if (sauces.length <= cnt_s && flg_s) {
                                                                    db.collection("sizes", function(err, collection) {
                                                                        collection.find({ 'size': size }).toArray(function(err, items) {
                                                                            if (items.length > 0) {
                                                                                cost_s = parseInt(items[0].cost, 10);
                                                                                db.collection("crustes", function(err, collection) {
                                                                                    collection.find({ 'type': crust }).toArray(function(err, items) {
                                                                                        if (items.length > 0) {
                                                                                            cost_c = parseInt(items[0].cost, 10);
                                                                                            db.close();
                                                                                            MongoClient.connect(url, function(err, db) {
                                                                                                var len = 0;
                                                                                                db.collection("pizzaorders").find({}).toArray(function(err, items) {
                                                                                                    len = items.length;
                                                                                                    db.collection("pizzaorders").insert({
                                                                                                        'order_id': "pizzaboyy" + len,
                                                                                                        'cheeses': cheeses,
                                                                                                        'toppings': toppings,
                                                                                                        'sauces': sauces,
                                                                                                        'crust': crust,
                                                                                                        'size': size,
                                                                                                        'comment': comment,
                                                                                                        'name': name,
                                                                                                        'address': address,
                                                                                                        'city': city,
                                                                                                        'pincode': pincode,
                                                                                                        'phone_number': phone_number,
                                                                                                        'total_price': (cost_c + cost_s + costc + costs + costt + 60) + "",
                                                                                                        'date_time': new Date() + "",
                                                                                                        'status': "placed"
                                                                                                    }, { w: 1 }, function(err, done) {
                                                                                                        if (!err) {
                                                                                                            db.close();
                                                                                                            console.log("vah bhura!!!");
                                                                                                            res.json({ 'error': 0, 'order_id': "pizzaboyy" + len });
                                                                                                            next();
                                                                                                        } else {
                                                                                                            res.json({ 'error': 1, 'error_details': "error with insert" });
                                                                                                        }
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        } else {
                                                                                            res.json({ 'error': 1, 'error_details': "error with crust" });
                                                                                        }
                                                                                    });
                                                                                });
                                                                            } else {
                                                                                res.json({ 'error': 1, 'error_details': "error with size" });
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            } else {
                                                                flg_t = false;
                                                                res.json({ 'error': 1, 'error_details': "error with sauces" });
                                                            }
                                                        });
                                                    });
                                                });
                                            }
                                        } else {
                                            flg_t = false;
                                            res.json({ 'error': 1, 'error_details': "error with toppings" });
                                        }
                                    });
                                });
                            });
                        }
                    } else {
                        flg_c = false;
                        res.json({ 'error': 1, 'error_details': "error with cheeses" });
                    }
                });
            });
        });
    });
}


function get_order_details(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("pizzaorders").find({ 'order_id': req.params.id }).toArray(function(err, items) {
            if (items.length <= 0) {
                res.json({ 'error': 1, 'error_details': "no id found" });
            } else {
                res.json(items);
            }
        });
    });
}

function delete_order(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("pizzaorders").find({ 'order_id': req.params.id }).toArray(function(err, items) {
            if (items.length > 0) {
                db.collection("pizzaorders").remove({ 'order_id': req.params.id }, function(err, items) {
                    res.json({ 'error': 0, 'details': req.params.id + " id deleted" });
                });
            } else {
                res.json({ 'error': 1, 'error_details': req.params.id + " id not found" });
            }
        });
    });
}

function view_all(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("pizzaorders").find({}).toArray(function(err, items) {
            res.json({ 'error': 0, 'total': items.length, 'orders': items });
        });
    });
}

function update_status(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("pizzaorders").find({ 'order_id': req.params.id }).toArray(function(err, items) {
            if (items.length > 0) {
                db.collection("pizzaorders").update({ 'order_id': req.params.id }, { $set: { 'status': req.params.status } }, function(err, items) {
                    res.json({ 'error': 0, 'details': req.params.id + " id updated with the status " + req.params.status });
                });
            } else {
                res.json({ 'error': 1, 'error_details': req.params.id + " id not found" });
            }
        });
    });
}

function get_cheeses(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("cheeses").find({}).toArray(function(err, items) {
            res.json({ 'error': 0, 'total': items.length, 'cheeses': items });
        });
    });
}

function add_cheeses(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("cheeses").find({ 'type': req.params.cheese }).toArray(function(err, items) {
            if (items.length > 0) {
                res.json({ 'error': 1, 'details': req.params.cheese + ' cheeses already exist' });
            } else {
                db.collection("cheeses").insert({ 'type': req.params.cheese, 'cost': req.params.cost }, { w: 1 }, function(err, done) {
                    res.json({ 'error': 0, 'status': req.params.cheese + ' cheeses added with cost ' + req.params.cost });
                });
            }
        });
    });
}

function delete_cheeses(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("cheeses").find({ 'type': req.params.cheese }).toArray(function(err, items) {
            if (items.length > 0) {
                db.collection("cheeses").remove({ 'type': req.params.cheese }, function(err, items) {
                    res.json({ 'error': 0, 'details': req.params.cheese + " cheese deleted" });
                });
            } else {
                res.json({ 'error': 1, 'error_details': req.params.cheese + " cheese not found" });
            }
        });
    });
}

function get_crustes(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("crustes").find({}).toArray(function(err, items) {
            res.json({ 'error': 0, 'total': items.length, 'crustes': items });
        });
    });
}

function add_crustes(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("crustes").find({ 'type': req.params.crust }).toArray(function(err, items) {
            if (items.length > 0) {
                res.json({ 'error': 1, 'details': req.params.crust + ' crustes already exist' });
            } else {
                db.collection("crustes").insert({ 'type': req.params.crust, 'cost': req.params.cost }, { w: 1 }, function(err, done) {
                    res.json({ 'error': 0, 'status': req.params.crust + ' crustes added with cost ' + req.params.cost });
                });
            }
        });
    });
}

function delete_crustes(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("crustes").find({ 'type': req.params.crust }).toArray(function(err, items) {
            if (items.length > 0) {
                db.collection("crustes").remove({ 'type': req.params.crust }, function(err, items) {
                    res.json({ 'error': 0, 'details': req.params.crust + " crust deleted" });
                });
            } else {
                res.json({ 'error': 1, 'error_details': req.params.crust + " crust not found" });
            }
        });
    });
}

function get_toppings(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("toppings").find({}).toArray(function(err, items) {
            res.json({ 'error': 0, 'total': items.length, 'toppings': items });
        });
    });
}

function add_toppings(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("toppings").find({ 'type': req.params.topping }).toArray(function(err, items) {
            if (items.length > 0) {
                res.json({ 'error': 1, 'details': req.params.topping + ' toppings already exist' });
            } else {
                db.collection("toppings").insert({ 'type': req.params.topping, 'cost': req.params.cost }, { w: 1 }, function(err, done) {
                    res.json({ 'error': 0, 'status': req.params.topping + ' toppings added with cost ' + req.params.cost });
                });
            }
        });
    });
}

function delete_toppings(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("toppings").find({ 'type': req.params.topping }).toArray(function(err, items) {
            if (items.length > 0) {
                db.collection("toppings").remove({ 'type': req.params.topping }, function(err, items) {
                    res.json({ 'error': 0, 'details': req.params.topping + " topping deleted" });
                });
            } else {
                res.json({ 'error': 1, 'error_details': req.params.topping + " topping not found" });
            }
        });
    });
}

function get_sizes(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("sizes").find({}).toArray(function(err, items) {
            res.json({ 'error': 0, 'total': items.length, 'sizes': items });
        });
    });
}

function add_sizes(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("sizes").find({ 'type': req.params.size }).toArray(function(err, items) {
            if (items.length > 0) {
                res.json({ 'error': 1, 'details': req.params.size + ' sizes already exist' });
            } else {
                db.collection("sizes").insert({ 'type': req.params.size, 'cost': req.params.cost }, { w: 1 }, function(err, done) {
                    res.json({ 'error': 0, 'status': req.params.size + ' sizes added with cost ' + req.params.cost });
                });
            }
        });
    });
}

function delete_sizes(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("sizes").find({ 'type': req.params.size }).toArray(function(err, items) {
            if (items.length > 0) {
                db.collection("sizes").remove({ 'type': req.params.size }, function(err, items) {
                    res.json({ 'error': 0, 'details': req.params.size + " size deleted" });
                });
            } else {
                res.json({ 'error': 1, 'error_details': req.params.size + " size not found" });
            }
        });
    });
}

function get_sauces(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("sauces").find({}).toArray(function(err, items) {
            res.json({ 'error': 0, 'total': items.length, 'sauces': items });
        });
    });
}

function add_sauces(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("sauces").find({ 'type': req.params.sauce }).toArray(function(err, items) {
            if (items.length > 0) {
                res.json({ 'error': 1, 'details': req.params.sauce + ' sauces already exist' });
            } else {
                db.collection("sauces").insert({ 'type': req.params.sauce, 'cost': req.params.cost }, { w: 1 }, function(err, done) {
                    res.json({ 'error': 0, 'status': req.params.sauce + ' sauces added with cost ' + req.params.cost });
                });
            }
        });
    });
}

function delete_sauces(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    MongoClient.connect(url, function(err, db) {
        db.collection("sauces").find({ 'type': req.params.sauce }).toArray(function(err, items) {
            if (items.length > 0) {
                db.collection("sauces").remove({ 'type': req.params.sauce }, function(err, items) {
                    res.json({ 'error': 0, 'details': req.params.sauce + " sauce deleted" });
                });
            } else {
                res.json({ 'error': 1, 'error_details': req.params.sauce + " sauce not found" });
            }
        });
    });
}

var server = restify.createServer();

server.use(restify.queryParser());
server.get('/place_order/', place_order);
server.head('/place_order/', place_order);
server.post('/place_order/', place_order);

server.get('/get_order_details/:id', get_order_details);
server.head('/get_order_details/:id', get_order_details);
server.post('/get_order_details/:id', get_order_details);

server.get('/delete_order/:id', delete_order);
server.head('/delete_order/:id', delete_order);
server.post('/delete_order/:id', delete_order);

server.get('/view_all/', view_all);
server.head('/view_all/', view_all);
server.post('/view_all/', view_all);

server.get('/update_status/:id/:status', update_status);
server.head('/update_status/:id/:status', update_status);
server.post('/update_status/:id/:status', update_status);

server.get('/get_cheeses/', get_cheeses);
server.head('/get_cheeses/', get_cheeses);
server.post('/get_cheeses/', get_cheeses);

server.get('/add_cheeses/:cheese/:cost', add_cheeses);
server.head('/add_cheeses/:cheese/:cost', add_cheeses);
server.post('/add_cheeses/:cheese/:cost', add_cheeses);

server.get('/delete_cheeses/:cheese', delete_cheeses);
server.head('/delete_cheeses/:cheese', delete_cheeses);
server.post('/delete_cheeses/:cheese', delete_cheeses);

server.get('/get_crustes/', get_crustes);
server.head('/get_crustes/', get_crustes);
server.post('/get_crustes/', get_crustes);

server.get('/add_crustes/:crust/:cost', add_crustes);
server.head('/add_crustes/:crust/:cost', add_crustes);
server.post('/add_crustes/:crust/:cost', add_crustes);

server.get('/delete_crustes/:crust', delete_crustes);
server.head('/delete_crustes/:crust', delete_crustes);
server.post('/delete_crustes/:crust', delete_crustes);

server.get('/get_toppings/', get_toppings);
server.head('/get_toppings/', get_toppings);
server.post('/get_toppings/', get_toppings);

server.get('/add_toppings/:topping/:cost', add_toppings);
server.head('/add_toppings/:topping/:cost', add_toppings);
server.post('/add_toppings/:topping/:cost', add_toppings);

server.get('/delete_toppings/:topping', delete_toppings);
server.head('/delete_toppings/:topping', delete_toppings);
server.post('/delete_toppings/:topping', delete_toppings);

server.get('/get_sizes/', get_sizes);
server.head('/get_sizes/', get_sizes);
server.post('/get_sizes/', get_sizes);

server.get('/add_sizes/:size/:cost', add_sizes);
server.head('/add_sizes/:size/:cost', add_sizes);
server.post('/add_sizes/:size/:cost', add_sizes);

server.get('/delete_sizes/:size', delete_sizes);
server.head('/delete_sizes/:size', delete_sizes);
server.post('/delete_sizes/:size', delete_sizes);

server.get('/get_sauces/', get_sauces);
server.head('/get_sauces/', get_sauces);
server.post('/get_sauces/', get_sauces);

server.get('/add_sauces/:sauce/:cost', add_sauces);
server.head('/add_sauces/:sauce/:cost', add_sauces);
server.post('/add_sauces/:sauce/:cost', add_sauces);

server.get('/delete_sauces/:sauce', delete_sauces);
server.head('/delete_sauces/:sauce', delete_sauces);
server.post('/delete_sauces/:sauce', delete_sauces);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
