<template>
  <f7-page name="home" class="home-page-background">
    <!-- Top Navbar -->
    <f7-navbar large :sliding="false">
      <f7-nav-left>
        <f7-block>
          <f7-button fill popup-open="#my-popup">
            ?
          </f7-button>
        </f7-block>
      </f7-nav-left>

      <f7-nav-title sliding>Cookies Giveaway</f7-nav-title>
      <f7-nav-title-large class="title-page">Cookies Giveaway</f7-nav-title-large>
    </f7-navbar>

    <div class="home-page-content">
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
    <div class="popup popup-right" id="my-popup">
      <div class="view">
        <div class="page">
          <div class="navbar">
            <div class="navbar-bg"></div>
            <div class="navbar-inner">
              <div class="title">Popup</div>
              <div class="right">
                <a href="#" class="link popup-close">Close</a>
              </div>
            </div>
          </div>
          <div class="page-content">
            <div class="block">
              <p>Scan your cookie QR Code to participate</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </f7-page>
</template>

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
  cursor: pointer;
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
  font-size: 18px;
  font-weight: bold;
  gap: 10px;
}

.icon {
  width: 40px;
  height: 40px;
}

.options-list {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.popup-right {
  position: fixed;
  top: 10%;
  right: 10px;
  width: 300px;
  height: auto;
  background-color: #312115;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
}
</style>


