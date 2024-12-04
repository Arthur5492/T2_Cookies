<template>
  <f7-app v-bind="f7params">

  <!-- Views/Tabs container -->
  <f7-views tabs class="safe-areas">
    <!-- Tabbar for switching views-tabs -->
    <f7-toolbar tabbar icons bottom>
      <f7-link tab-link="#view-home" tab-link-active icon-ios="f7:house_fill" icon-md="material:home" text="Home"></f7-link>
      <f7-link tab-link="#view-catalog" icon-ios="f7:square_list_fill" icon-md="material:view_list" text="Catalog"></f7-link>
      <f7-link tab-link="#view-profile" icon-ios="f7:gear" icon-md="material:settings" text="Profile"></f7-link>
    </f7-toolbar>

    <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
    <f7-view id="view-home" main tab tab-active url="/"></f7-view>

    <!-- Catalog View -->
    <f7-view id="view-catalog" name="catalog" tab url="/catalog/"></f7-view>

    <!-- Profile View -->
    <f7-view id="view-profile" name="profile" tab url="/profile/"></f7-view>

  </f7-views>

    <!-- Popup -->
    <f7-popup id="my-popup">
      <f7-view>
        <f7-page>
          <f7-navbar title="Information">
            <f7-nav-right>
              <f7-link popup-close>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            <p>oi</p>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>

    <!-- Login -->
    <f7-login-screen id="my-login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>Login</f7-login-screen-title>
          <f7-list form>
            <f7-list-input
              type="text"
              name="username"
              placeholder="Your name"
              v-model:value="username"
            ></f7-list-input>
            <f7-list-input
              type="password"
              name="password"
              placeholder="Your Password"
              v-model:value="password"
            ></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button title="Sign In" @click="alertLoginData"></f7-list-button>
            <f7-block-footer>
              oi
            </f7-block-footer>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>

    <!-- QR Code -->
    <f7-popup id="qr-code">
      <div id="reader" style="width:600px"></div>
      <div id="reader-results"></div>
      <button @click="scan">Scan</button>
    </f7-popup>

  </f7-app>
</template>

<script>

  import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
  import { ref, onMounted } from 'vue';
  import { f7, f7ready } from 'framework7-vue';
  import routes from '../js/routes.js';

  export default {
    scan() {
      const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`Code matched = ${decodedText}`, decodedResult);

        const resultsContainer = document.getElementById("reader-results");
        resultsContainer.innerHTML = `<p><strong>Resultado:</strong> ${decodedText}</p>`;
      };

      const onScanFailure = (error) => {
        console.warn(`Code scan error = ${error}`);
      };

      const html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 300, height: 300 }, formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] },
        /* verbose= */ false
      );

      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    },

    setup() {
      // Framework7 Parameters
      const f7params = {
        name: 'Cookies Giveaway', // App name
        theme: 'auto', // Automatic theme detection
        colors: {
          primary: '#46220f',
        },
        // App routes
        routes: routes,

        // Register service worker (only on production build)
        serviceWorker: process.env.NODE_ENV ==='production' ? {
          path: '/service-worker.js',
        } : {},
      };
      // Login screen data
      const username = ref('');
      const password = ref('');

      const alertLoginData = () => {
        f7.dialog.alert('Username: ' + username.value + '<br>Password: ' + password.value, () => {
          f7.loginScreen.close();
        });
      }

      onMounted(() => {
        f7ready(() => {

        // Call F7 APIs here
        });
      });

      return {
        f7params,
        username,
        password,
        alertLoginData
      }
    }
  }

</script>

<style>
#reader-results {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>