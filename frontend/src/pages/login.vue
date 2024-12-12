<template>
  <f7-page name="login" class="login-page">
    <div class="content-wrapper">
      <div class="login-container">
        <f7-block>
          <f7-block class="login-title">Login</f7-block>
          <f7-list form>
            <f7-list-input
              type="text"
              name="email"
              placeholder="Your email"
              v-model:value="email"
            ></f7-list-input>
            <f7-list-input
              type="password"
              name="password"
              placeholder="Your password"
              v-model:value="password"
            ></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-button @click="handleLogin" class="button-class">Log In</f7-button>
            <f7-button @click="handleSignup">Sign Up</f7-button>
          </f7-list>
        </f7-block>
      </div>
    </div>
  </f7-page>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
  height: 100vh; /* Garante que ocupa toda a altura da tela */
  background-image: url('../assets/images/background-login.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-title {
  color: #46392f;
  font-size: 35px;
}

.content-wrapper {
  display: flex;
  height: 100vh; /* Define a altura do container como 100% da viewport */
  justify-content: center; /* Centraliza horizontalmente o container interno */
  align-items: center; /* Centraliza verticalmente o container interno */
  max-width: 320px;
}

.login-container {
  background: rgba(255, 255, 255, 0.95); /* Fundo translúcido */
  padding: 40px 30px; /* Mais espaço interno pra destacar o conteúdo */
  border-radius: 15px; /* Bordas mais suaves */
  text-align: center;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.7); /* Sombra mais definida */
}

.button-class {
  display: flex;
  align-items: center;
  background-color: #b67747;
  color: white;
  margin-bottom: 10px;
  border-radius: 15px;
  text-align: center;
}

</style>

<script>
import { ref } from 'vue';
import { f7 } from 'framework7-vue';
import { login_api } from "../js/functions.js"; 

export default {
  setup() {
    const email = ref('');
    const password = ref('');

    const handleLogin = async () => {
      try {
        const response = await login_api(email.value, password.value);

        if (response) {
          f7.dialog.alert("Login success!");
          f7.views.main.router.navigate('/home/');
        } 
        else {
          f7.dialog.alert("An unexpected error occurred.");
        }
      }
      
      catch (error) {
        console.error('Error at login:', error);
        f7.dialog.alert(error);
      }
    };

    const handleSignup = () => {
      f7.views.main.router.navigate('/signup/');
    }

    return {
      email,
      password,
      handleLogin,
      handleSignup
    }
  }
};
</script>

  