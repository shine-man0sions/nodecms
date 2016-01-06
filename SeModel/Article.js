var mongoose = require('mongoose');
var validate = require('mongoose-validator');


var Schema = mongoose.Schema;

var Article = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    catid: { type: String ,required:true},
    content: { type: String},
    author: { type: String, required: true },
    sort:{ type: Number,default:100 },
    createtime: { type: Date, required: true, default: Date.now  },
    updatetime: { type: Date, default: Date.now  }

});

module.exports = db.model('Article', Article);

