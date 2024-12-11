<template>
  <f7-page name="login">
    <f7-navbar title="Login"></f7-navbar>

    <f7-block-title>Login into your account</f7-block-title>
    <f7-block>
      <f7-login-screen-title>Login</f7-login-screen-title>
      <f7-list form>
        <f7-list-input type="text" name="email" placeholder="Your email" v-model:value="email" ></f7-list-input>
        <f7-list-input type="password" name="password" placeholder="Your password" v-model:value="password"></f7-list-input>
      </f7-list>
      <f7-list>
        <f7-list-button title="Log In" @click="handleLogin"></f7-list-button>
        <f7-list-button title="Sign Up" @click="handleSignup"></f7-list-button>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

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


  