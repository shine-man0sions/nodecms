var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Goods = new Schema({
    name: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    add_time: { type: Date, required: true, default: Date.now  },
    update_time: { type: Date, default: Date.now  }

});

module.exports = db.model('Goods', Goods);

