const mongoose = require('mongoose');

// const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


//para utilizar un plugin en particular
// categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Categoria', categoriaSchema);
