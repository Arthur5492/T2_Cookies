<template>
    <f7-page name="signup">
      <f7-navbar title="Signup" back-link="Back"></f7-navbar>
  
      <f7-block-title>Update your personal data</f7-block-title>
      <f7-block>
        <f7-list strong-ios dividers-ios outline-ios form>
          <f7-list-input label="Name" type="text" v-model:value="name" placeholder="Name"></f7-list-input>
          <f7-list-input label="E-mail" type="email" v-model:value="email" placeholder="E-mail"></f7-list-input>
          <f7-list-input label="Password" type="password" v-model:value="password" placeholder="Password"></f7-list-input>
          <f7-list-input label="Phone" type="tel" v-model:value="phone" placeholder="Phone"></f7-list-input>
          <f7-list-input label="Gender" type="select" v-model:value="gender">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </f7-list-input>
          <f7-list-input label="Birth date" type="date" v-model:value="birth_date" placeholder="Birth day"></f7-list-input>
        </f7-list>
        <f7-list>
          <f7-list-button title="Save" @click="signUser"></f7-list-button>
        </f7-list>
      </f7-block>
    </f7-page>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { f7 } from 'framework7-vue';
  import { sign_user_api } from "../js/functions.js";
  
  export default {
    setup() {
      const name = ref('');
      const email = ref('');
      const password = ref('');
      const phone = ref('');
      const gender = ref('');
      const birth_date = ref('');
  
      const signUser = async () => {
        try {
          const response = await sign_user_api(
            name.value,
            email.value,
            password.value,
            phone.value,
            gender.value,
            birth_date.value
          );
  
          if (response) {
            f7.dialog.alert("Sign success!");
            f7.views.main.router.navigate('/home/');
          } else {
            f7.dialog.alert("An unexpected error occurred.");
          }
        } 
        catch (error) {
          console.error('Error at signing up:', error);
          f7.dialog.alert(error);
        }
      };
  
      return {
        name,
        email,
        password,
        phone,
        gender,
        birth_date,
        signUser,
      };
    }
  };
  </script>
  