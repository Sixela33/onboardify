// backend/test-email.js
const path = require('path');
// Usamos 'dotenv' para cargar las variables de entorno del archivo .env
// Le especificamos la ruta correcta al archivo .env
require('dotenv').config({ path: path.resolve(__dirname, './.env') }); 
const { Resend } = require('resend');

const testSendEmail = async () => {
  // 1. Verificamos que la API Key esté cargada
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Error: La variable de entorno RESEND_API_KEY no está definida.');
    console.log('Asegúrate de tener un archivo .env en la carpeta /backend con tu API key.');
    return;
  }

  // 2. Verificamos que el email de destino esté configurado
  const toEmail = process.env.ONBOARDING_NOTIFICATION_EMAIL;
  if (!toEmail) {
    console.error('Error: La variable de entorno ONBOARDING_NOTIFICATION_EMAIL no está definida.');
    return;
  }

  console.log(`Intentando enviar email a: ${toEmail}`);
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Onboarding Notifier <onboarding@resend.dev>', // Asegúrate de que este dominio esté verificado en Resend
      to: [toEmail],
      subject: 'Prueba de Notificación de Onboarding',
      html: `
        <h1>¡Esto es una prueba!</h1>
        <p>Si recibes este correo, la configuración de <strong>Resend</strong> funciona correctamente.</p>
      `,
    });

    if (error) {
      console.error('Error al enviar el email:', error);
      return;
    }

    console.log('¡Email enviado exitosamente!');
    console.log('ID del Email:', data.id);

  } catch (e) {
    console.error('Ocurrió una excepción al enviar el email:', e);
  }
};

// Ejecutamos la función de prueba
testSendEmail(); 