const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    base:{
        type:String,
        require:[true , 'please provide base value as subject_key']
    },
    key: {
        type: Number,
        required: [true, 'Please provide key'],
      },
    subject : {
        type: String,
        require : [true , ' Please provide subject name']
    },
    folder: []
})


module.exports = mongoose.model('Session', UserSchema)