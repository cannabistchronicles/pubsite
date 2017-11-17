var mongoose = require('mongoose');
var random = require('mongoose-simple-random');

var schema = mongoose.Schema( {
            title: String,
            mainImg:String,
            preview: String,
            body: String,
            tags: Array,
            category: String,
            author: String,
            postdate: String
        });
schema.plugin(random);
module.exports = mongoose.model('Blog', schema);