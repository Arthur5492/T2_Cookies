<template>
    <f7-page name="qr-code">
      <f7-navbar title="QR Code" back-link="Back"></f7-navbar>
      <f7-block-title>Scan your QR Code</f7-block-title>
      <f7-block>
        <div id="reader" style="width:600px;"></div>
        <div id="reader-results"></div>
      </f7-block>
    </f7-page>
  </template>
  
  <script>
  import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
  import { f7 } from 'framework7-vue';
  import { insert_cookie_api } from "../js/functions";
  
  export default {
    setup() {
      return {
        html5QrcodeScanner: null,
      };
    },
    
    methods: {
      initializeScanner() {
        if (!this.html5QrcodeScanner) {
          this.html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            {
              fps: 10,
              qrbox: { width: 300, height: 300 },
              formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            },
            /* verbose= */ false
          );
  
          this.html5QrcodeScanner.render(this.onScanSuccess);
        } 
        else {
          console.log("Scanner already initialized.");
        }
      },

      async onScanSuccess(decodedText, decodedResult) {
        const cookie_id = decodedText;
        console.log(`Code matched = ${cookie_id}`);

        try {
          const response = await insert_cookie_api(cookie_id);
          const data = await response.json();

          if (response.ok) {
            f7.dialog.alert('Cookie submited!');
            f7.loginScreen.close();
          } 
          else {
            console.log(data);
            f7.dialog.alert('An unexpected error occurred.');
          }
        } 
        catch (error) {
          console.error('Error at submiting cookie:', error);
          f7.dialog.alert('Error connecting to server.');
        }

        const resultsContainer = document.getElementById("reader-results");
        resultsContainer.innerHTML = `<p><strong>Resultado:</strong> ${decodedText}</p>`;
      },

      stopScanner() {
        if (this.html5QrcodeScanner) {
          this.html5QrcodeScanner.clear();
          console.log("Camera stopped.");
        }
      },
    },

    mounted() {
        // Inicializa o scanner automaticamente ao carregar o componente
        this.initializeScanner();
    },
    
    beforeDestroy() {
        // Para o scanner quando o componente é destruído
        this.stopScanner();
    },
  };
  </script>
  