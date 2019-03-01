const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
const _ = require('underscore');

let Categoria = require('../models/categoria');


// ==============================
// Mostrar todas las categorias
// ==============================
app.get('/categoria',verificaToken, (req, res)=>{

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err, categorias)=>{

        if(err){
            return res.status(500).json({
                ok: false,
            err
            });
        }


        Categoria.count((err, conteo)=>{
            res.json({
                ok: true,
                categorias,
                cuantos: conteo
            })
        });

    });

});

// ===============================
// Mostrar una categoria por ID
// ===============================
app.get('/categoria/:id',verificaToken, (req, res)=>{

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


// ================================
// Crear nueva categoria
// ================================
app.post('/categoria', verificaToken, (req, res)=>{

    let body = req.body;
    let id = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    });

    // guardar los datos en DB
    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// =================================
// Actualizar una categoria
// =================================
app.put('/categoria/:id', verificaToken, (req, res)=>{

    let id= req.params.id;
    // let body = _.pick(req.body, 'descripcion');
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});


// ======================================
// Eliminar una categoria - físicamente
// ======================================
app.delete('/categoria/:id',[verificaToken, verificaAdmin_Role ] ,(req, res)=>{
    // solo un administrador puede borrar categorias

    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            // categoria: categoriaBorrado
            message: 'Categoria Borrada'
        })

    })
});

module.exports = app;