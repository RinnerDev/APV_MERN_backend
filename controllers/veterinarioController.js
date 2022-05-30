//------ controllers > veterinarioController.js -----//
import Veterinario from "../models/veterinarioModel.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegister from "../helpers/emailRegister.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {

    const {email, nombre} = req.body;

    const usuarioExiste = await Veterinario.findOne({email})

    if(usuarioExiste) {
        const error = new Error('El usuario ya existe');
        return res.status(400).json({msg: error.message});
    } 

    try {
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save();

        //Enviar mail
        emailRegister({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json({veterinarioGuardado});
    } catch (error) {
        console.log(error)
    }

}

const perfil = (req, res) => {
    const { veterinario }= req

    res.json(veterinario);
}

const confirmar = async (req, res) => {
    const {token} = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});

    if(!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()

        res.json({msg: 'Usuario confirmado correctamente'})
    } catch (error) {
        console.log(error)
    }
    

}

const autenticar = async (req, res) =>{
    const {email, password} = req.body;
    const usuario = await Veterinario.findOne({email});

    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(402).json({msg: error.message})
    }

    if(!usuario.confirmado) {
        const error = new Error('Usuario no confirmado');
        return res.status(402).json({msg: error.message});
    }

    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        })
    } else {
        const error = new Error('Password incorrecto');
        return res.status(402).json({msg: error.message});
    }
}

const resetPassword = async (req, res)=> {
    const {email} = req.body
    const veterinarioExiste = await Veterinario.findOne({email});

    if(!veterinarioExiste){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinarioExiste.token = generarId();
        await veterinarioExiste.save();

        //Enviar email
        emailOlvidePassword({
            email,
            nombre: veterinarioExiste.nombre,
            token: veterinarioExiste.token
        })
        res.json({msg:'Hemos enviado un correo a su email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }

}

const comprobarToken = async (req, res)=> {
    const {token} = req.params
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido) {
        res.json({msg: 'Token valido y el usuario existe'})
    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res)=> {

    const {token} = req.params
    const {password} = req.body
    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password
        
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'});

    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario){
        const error = new Error('Hubo un inconveniente')
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const emailExiste = await Veterinario.findOne({email})
        if(emailExiste) {
            const error = new Error('Email ya en uso')
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono
        veterinario.email = req.body.email

        const veterinarioActualizado = await veterinario.save()

        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {
    //Leer los datos
    const {id} = req.veterinario
    const {password_actual, password_nuevo } = req.body

    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error('Hubo un inconveniente')
        return res.status(400).json({msg: error.message})
    }
    
    //Comprobar password actual
    if(await veterinario.comprobarPassword(password_actual)) {
        //Almacenar el nuevo password
        veterinario.password = password_nuevo
        await veterinario.save()
        res.json({msg: 'Password almacenado correctamente'})
    } else {
        const error = new Error('El password actual es incorrecto')
        return res.status(400).json({msg: error.message})
    }

    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}