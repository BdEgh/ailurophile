const { Schema, model } = require('mongoose');

const schema = new Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: "Нет описания :("
    },
    date: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true
    }
});

module.exports = model('image', schema)