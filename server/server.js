require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // dar acceso public 

const app = express();
const bodyParser = require('body-parser');

//Nota: cuando mires app.use ->son middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))    
 
// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use( express.static(path.resolve(__dirname, '../public')));



// Configuración global de rutas
app.use( require('./routes/index'));

//conectarnos a nuestra base de datos
// mongoose.connect('mongodb://localhost:27017/cafe', (err, res)=>{
//     if(err) throw err;

//     console.log('Base de datos ONLINE');
// });
// mongoose.connect(process.env.URLDB,{
//     useCreateIndex: true,
//     useNewUrlParser: true
// }, (err, res) =>{
//     if(err) throw err;
//     console.log('Base de datos ONLINE');
// }); 

mongoose.connect(process.env.URLDB, {
    useCreateIndex: true,
    useNewUrlParser: true
})
.then( db => console.log('Base de datos ONLINE')) 
.catch( err => console.log(err));
 
app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto: ', process.env.PORT);
})

