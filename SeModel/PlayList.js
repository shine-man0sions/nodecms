var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlayList = new Schema({
    title: { type: String, required: true},

    image: { type: String,required: true},
    vid  : { type: String, required: true,unique:true},
    video_count:{ type: String, required: true},
    add_time: { type: Date, required: true, default: Date.now  },
    update_time: { type: Date, default: Date.now  }

});

module.exports = db.model('PlayList', PlayList);




