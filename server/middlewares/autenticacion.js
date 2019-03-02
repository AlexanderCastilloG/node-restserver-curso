const jwt = require('jsonwebtoken');

// ============================
// Verificar Token
// ============================
let verificaToken = (req, res, next)=>{

    let token = req.get('token'); //nombre del header

    jwt.verify(token, process.env.SEED, (err, decoded)=>{

        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no válido'
                }
            });
        }

        //creando el payload  ->decoded.usuario ->es el payload de la carga del token ->del login
        req.usuario = decoded.usuario;
        next();
    });
    // res.json({
    //     token
    // });
};


// ==============================
// Verifica AdminRole
// ==============================
let verificaAdmin_Role = (req, res, next) =>{
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
       next();
    }else{
        res.json({
            ok:false,
            err:{
                message: 'El usuario no es administrador'
            }
        })
    }
}


// ==============================
// Verifica token para imagen
// ==============================
let verificaTokenImg = (req, res, next)=>{
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded)=>{

        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}