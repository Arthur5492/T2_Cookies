<template>
  <f7-page name="home">
    
    <!-- Top Navbar -->
    <f7-navbar large :sliding="false">
      <f7-nav-title sliding>Cookies Giveaway</f7-nav-title>      
      <f7-nav-title-large>Cookies Giveaway</f7-nav-title-large>
    </f7-navbar>

    <!-- Page content-->
    <f7-block>
      <p>Isso é um sorteio</p>
    </f7-block>
    
    <f7-block-title>Modals</f7-block-title>
    <f7-block class="grid grid-cols-2 grid-gap">
      <f7-button fill popup-open="#my-popup">?</f7-button>
      <f7-button fill login-screen-open="#my-login-screen">Login</f7-button>
    </f7-block>

    <f7-block-title>Panels</f7-block-title>
    <f7-block class="grid grid-cols-2 grid-gap">
      <f7-button fill panel-open="#qr-code">Scan QR Code</f7-button>
    </f7-block>

  </f7-page>
</template>