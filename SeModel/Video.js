var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Video = new Schema({
    title: { type: String, required: true},
    image: { type: String},
    playlistId  : { type: String, required: true},
    vid  : { type: String, required: true,unique:true},
    videoseq:{ type: String, required: true},
    click:{ type: String},
    add_time: { type: Date, required: true, default: Date.now  },
    update_time: { type: Date, default: Date.now  }

});

module.exports = db.model('video', Video);




