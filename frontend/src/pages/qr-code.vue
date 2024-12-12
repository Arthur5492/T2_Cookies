<template>
  <f7-page name="qr-code">
    <f7-navbar title="QR Code" back-link="Back"></f7-navbar>
    <f7-block-title>Scan your QR Code</f7-block-title>
    <f7-block>
      <div id="reader"></div>
    </f7-block>
  </f7-page>
</template>
  
<script>
import { Html5Qrcode } from "html5-qrcode";
import { f7 } from "framework7-vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { insert_cookie_api } from "../js/functions";

export default {
  setup() {
    const html5Qrcode = ref(null);
    const cooldown = ref(false);

    const initializeScanner = () => {
      const readerElement = document.getElementById("reader");

      if (!html5Qrcode.value) {
        html5Qrcode.value = new Html5Qrcode("reader");
        html5Qrcode.value
          .start(
            { facingMode: "environment" }, // or "user"
            {
              fps: 10,
              aspectRatio: 1, 
              qrbox: (videoWidth, videoHeight) => {
                const sideLength = Math.min(videoWidth, videoHeight) * 0.8;
                return { width: sideLength, height: sideLength };
              }
            },
            onScanSuccess
          )
          .catch((err) => {
            console.error("Erro ao iniciar o scanner:", err);
          });
      } else {
        console.log("Scanner já iniciado");
      }
    };


    const onScanSuccess = async (decodedText) => {
      if (cooldown.value) return;

      console.log(`Code matched = ${decodedText}`);
      cooldown.value = true;

      try {
        const response = await insert_cookie_api(decodedText);

        if (response) {
          f7.dialog.alert("Cookie submitted!");
        } 
        else {
          f7.dialog.alert("An unexpected error occurred.");
        }
      } 
      catch (error) {
        console.error("Error at submitting cookie:", error);
        f7.dialog.alert(error);
      } 
      finally {
        setTimeout(() => {
          cooldown.value = false;
        }, 2000);
      }
    };

    const stopScanner = () => {
      if (html5Qrcode.value) {
        html5Qrcode.value
          .stop()
          .then(() => {
            console.log("Scanner stopped.");
          })
          .catch((err) => {
            console.error("Error stopping scanner:", err);
          });
      }
    };

    onMounted(() => {
      initializeScanner();
    });

    onBeforeUnmount(() => {
      stopScanner();
    });

    return {
      html5Qrcode,
      cooldown,
      initializeScanner,
      stopScanner,
    };
  },
};
</script>

<style>

#reader {
  width: 100%;
  max-width: 400px; /* Ajuste conforme necessário */
  height: 0;
  padding-bottom: 100%; /* Torna o container quadrado */
  margin: 0 auto;
  position: relative;
  background: #000; /* Fundo preto para destacar o vídeo */
  border-radius: 10px; /* Deixa os cantos arredondados, opcional */
  overflow: hidden; /* Garante que nada ultrapasse o container */
}

#reader video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Preenche o container sem distorção */
}

</style>
  