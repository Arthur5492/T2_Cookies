#!/usr/bin/env node

// Exemplo: 
// node push-cli.js --cookieId "123-0" --message "Parabens, voce foi sorteado na promocao dos produtos X, entre em contato para receber seu premio"

import fetch from 'node-fetch';
import yargs from 'yargs'; 

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --cookieId <cookieId> --message <message>')
  .demandOption(['cookieId', 'message'])
  .argv;

// Obtenha os parâmetros da linha de comando
const { cookieId, message } = argv;

// Enviar push notification
async function sendNotification() {
  try {
    const response = await fetch('http://localhost:3000/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cookieId, message }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Notification sent successfully:', result);
    } else {
      console.error('Error sending notification:', result);
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

sendNotification();
