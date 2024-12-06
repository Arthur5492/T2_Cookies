<template>
  <f7-app v-bind="f7params">
      
    <!-- Left panel -->
    <f7-panel left cover dark>
      <f7-view>
        <f7-page>
          <f7-navbar title="Left Panel"></f7-navbar>
          <f7-block>Left panel content goes here</f7-block>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>

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

  </f7-app>
</template>


<script>
import routes from "../js/routes.js"; 

export default {
  setup() {
    // Framework7 Parameters
    const f7params = {
      name: 'Cookies Giveaway', // App name
      theme: 'auto', // Automatic theme detection
      colors: {
        primary: '#3b1e08',
      },
      // App routes
      routes: routes,

      // Register service worker (only on production build)
      serviceWorker: process.env.NODE_ENV ==='production' ? {
        path: '/service-worker.js',
      } : {},
    };

    return {
      f7params,
    }
  }
};
</script>
