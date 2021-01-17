var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tramosSchema = new Schema({
    tramo: { type: Number, required: [true, 'El nombre es necesario'] },
    motociclistas: { type: Number, required: [true, 'El precio únitario es necesario'] },

});


module.exports = mongoose.model('Tramos', tramosSchema);