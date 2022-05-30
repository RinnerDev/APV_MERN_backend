import nodemailer from 'nodemailer';

const emailRegister = async (dato) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {email, nombre, token} = dato;

      const info = await transport.sendMail({
          from: 'APV - Admin. de Pacientes de Veterinaria',
          to: email,
          subject: 'Valida tu cuenta de APV',
          text: 'Comprueba tu correo electronico',
          html: `<p>Hola ${nombre}, gracias por unirte a nuestro equipo, para</p>
                <p>finalizar tu registro comprueba to correo electronico</p>
                <p>ingresando al siguiente link: <a href='${process.env.FRONT_URL}/confirmar-cuenta/${token}'> Comprobar email</a>
                
                <p>Si tu no creaste esta cuenta, puedes ignorar este mail</p>'`
      });

      console.log('Mensaje enviado: %s', info.messageId);
}

export default emailRegister