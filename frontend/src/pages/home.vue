<template>
  <f7-page name="home" class="home-page-background">

    <!-- Top Navbar -->
    <f7-navbar large :sliding="false">
      <f7-nav-right>
        <f7-block>
          <f7-button class="popup-style" popup-open="#my-popup">
            ?
          </f7-button>
        </f7-block>
      </f7-nav-right>

      <f7-nav-title sliding>Cookies Giveaway</f7-nav-title>
      <f7-nav-title-large>Cookies Giveaway</f7-nav-title-large>
    </f7-navbar>

    <div class="home-page-content">

      <!-- Countdown Timer -->
      <div class="countdown-container">
        <span class="countdown-text">Time left: </span>
        <span id="countdown-timer" class="countdown-timer"></span>
      </div>

      <!-- QR Code Button -->
      <div class="qr-button-container">
        <f7-link href="/qr-code/" class="qr-button">
          <img src="../assets/images/cookie.png" alt="cookie icon" class="icon">
          <span class="qr-button-text">SCAN NOW!</span>
          <img src="../assets/images/mouse.png" alt="mouse icon" class="icon">
        </f7-link>
      </div>

      <!-- Page content -->
      <f7-list strong inset dividersIos class="options-list">
        <f7-list-item link="/about/" title="About"></f7-list-item>
        <f7-list-item link="/profile/" title="Profile"></f7-list-item>
        <f7-list-item link="/cookies/" title="My Cookies"></f7-list-item>
        <f7-list-item link="/login/" title="Log In"></f7-list-item>
      </f7-list>

    </div>

    <!-- Popup -->
    <f7-popup id="my-popup">
      <f7-view>
        <f7-page>
          <f7-navbar title="Popup">
            <f7-nav-right>
              <f7-link popup-close>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            <p>Popup content goes here.</p>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>

  </f7-page>
</template>

<script>
import { send_notification_countdown_api, authenticate_api } from '../js/functions.js';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const countdownFlag = ref(false); // Flag to Countdown Timer
    const countdownTime = ref(10); // Seconds
  
    const authenticateUser = async () => {
      await authenticate_api(); // Apenas chama a função de autenticação
    }

    const startCountdown = () => {
        const timerElement = document.getElementById("countdown-timer");
        const countdownInterval = setInterval(() => {
          if (countdownTime.value <= 0) {
            clearInterval(countdownInterval);
            triggerCountdownEvent();
          } else {
            countdownTime.value -= 1;
            timerElement.textContent = formatTime(countdownTime.value);
          }
        }, 1000);
      }

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
      
    const triggerCountdownEvent = async () => {
      await send_notification_countdown_api();
    }

    onMounted(() => {
      authenticateUser();
      if (countdownFlag.value) startCountdown();
    })

  },
};
</script>

<style scoped>
.home-page-background {
  background-image: url('../assets/images/background-home.jpg');
  background-size: cover;
  background-position: top center;
  padding: 20px;
}

.home-page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding-top: 20px;
}

.countdown-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #9b5a28;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 320px;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.qr-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #312115;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 320px;
  transition: transform 0.2s ease;
}

.qr-button-container:hover {
  transform: scale(1.05);
}

.qr-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: #fff;
  font-size: 19px;
  font-weight: bold;
  gap: 10px;
}

.icon {
  width: 40px;
  height: 40px;
}

.popup-style {
  background-color: #9b5a28;
  color: white;
}

.options-list {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style>
