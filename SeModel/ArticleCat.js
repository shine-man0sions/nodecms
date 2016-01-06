var mongoose = require('mongoose');
var validate = require('mongoose-validator');


var Schema = mongoose.Schema;

var ArticleCat = new Schema({
    name: { type: String, required: true },
    parentid: { type: String,required:true,default:0 },
    image: { type: String },
    content: { type: String },
    sort: { type:Number,default:50 },
    createtime: { type: Date, required: true, default: Date.now  },
    updatetime: { type: Date, default: Date.now  }

});

module.exports = db.model('ArticleCat', ArticleCat);

