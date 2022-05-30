import nodemailer from 'nodemailer';

const emailOlvidePassword = async (dato) => {
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
          subject: 'Solicitud de nuevo password',
          text: 'Crea un nuevo password',
          html: `<p>Hola ${nombre},ingresa por favor al siguiente link</p>
                <p>para poder restablecer tu password</p>
                <a href='${process.env.FRONT_URL}/olvide-password/${token}'> Restablecer password</a>
                
                <p>Si tu no creaste esta cuenta, puedes ignorar este mail</p>'`
      });

      console.log('Mensaje enviado: %s', info.messageId);
}

export default emailOlvidePassword;