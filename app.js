const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.json());

const client = new Client();

client.on('qr', (qr) => {
    console.log('Escanea este código QR con tu app de WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Cliente de WhatsApp listo!');
});

client.initialize();

app.get('/', (req, res) => {
    res.send('¡Hola! La app de WhatsApp está funcionando 🚀');
});

app.post('/send-wsp',upload.single('file'), async (req, res) => {
    // const {  } = req.body;

    // if (!numero || !mensaje) {
    //     return res.status(400).json({ error: 'Número y mensaje son requeridos' });
    // }

    // try {
    //     await client.sendMessage(`${numero}@c.us`, mensaje);
    //     res.json({ success: true, message: `Mensaje enviado a ${numero}` });
    // } catch (error) {
    //     console.error('Error al enviar mensaje:', error);
    //     res.status(500).json({ error: 'No se pudo enviar el mensaje' });
    // }
    const { numero, mensaje } = req.body;

    try {
        // Crear el objeto de medios directamente desde el archivo recibido
        const media = new MessageMedia('application/pdf', req.file.buffer.toString('base64'), req.file.originalname);

        // Enviar el archivo por WhatsApp
        await client.sendMessage(`${numero}@c.us`, media, { caption: mensaje });

        res.status(200).json({ success: 'Archivo enviado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'No se pudo enviar el archivo' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
