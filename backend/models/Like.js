const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    userId: {type: String, required: true},
    likes: { type: Number}
});

module.exports = mongoose.model('Like', likeSchema);