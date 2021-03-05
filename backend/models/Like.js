const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    userId: {type: String, required: true},
    likes: { type: Number},
    //dislikes: {type: Number,required: true},
    //usersLiked: [{type: String,required: true}],
    //usersDisliked: [{type: String,required: true}]
});

module.exports = mongoose.model('Like', likeSchema);


