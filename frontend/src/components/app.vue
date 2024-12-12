<template>
  <f7-app v-bind="f7params">
    <f7-view main class="safe-areas" url="/"></f7-view>
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
      routes: routes,
    };

    return {
      f7params,
    }
  }
};
</script>
