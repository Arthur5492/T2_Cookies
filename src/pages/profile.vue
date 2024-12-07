<template>
  <f7-page name="profile">
    <f7-navbar title="Profile" back-link="Back"></f7-navbar>

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
        <f7-list-button title="Save" @click="updateProfile"></f7-list-button>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { f7 } from 'framework7-vue';
import { update_profile_api, get_user_data_api } from "../js/functions.js";

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const phone = ref('');
    const gender = ref('');
    const birth_date = ref('');

    const fetchUserData = async () => {
      try {
        const userData = await get_user_data_api();
        if (userData) {
          name.value = userData.user.name || '';
          email.value = userData.user.email || '';
          password.value = ''; // Normalmente não exibir senha real
          phone.value = userData.user.phone || '';
          gender.value = userData.user.gender || '';
          birth_date.value = userData.user.birth_date || '';
        } 
        else {
          f7.dialog.alert("Unable to load user data.");
        }
      } 
      catch (error) {
        console.error("Error fetching user data:", error);
        f7.dialog.alert("Error loading profile data.");
      }
    };

    const updateProfile = async () => {
      try {
        const response = await update_profile_api(
          name.value,
          email.value,
          password.value,
          phone.value,
          gender.value,
          birth_date.value
        );

        if (response) {
          f7.dialog.alert("Update success!");
        } else {
          f7.dialog.alert("An unexpected error occurred.");
        }
      } 
      catch (error) {
        console.error('Error at updating profile:', error);
        f7.dialog.alert(error);
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      name,
      email,
      password,
      phone,
      gender,
      birth_date,
      updateProfile
    };
  },
};
</script>
