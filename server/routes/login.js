const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario= require('../models/usuario');

const app = express();

//req->request , res-> response
app.post('/login', (req, res)=>{

    let body = req.body;

    Usuario.findOne({ email: body.email}, (err, usuarioDB)=>{

        if(err){
            //error del servidor
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        //usuario ->es el payload
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});



module.exports = app;