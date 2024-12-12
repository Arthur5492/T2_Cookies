<template>
    <f7-page name="cookies">
        <f7-navbar title="Signed Cookies" back-link="Back"></f7-navbar>
        <f7-block-title>Your cookies</f7-block-title>
        <f7-block>
            <f7-list>
                <f7-list-item v-for="(cookie, index) in cookie_ids" :key="index">
                {{ cookie }}
                </f7-list-item>
            </f7-list>
        </f7-block>
    </f7-page>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { f7 } from 'framework7-vue';
import { get_user_data_api } from "../js/functions.js"; 

export default {
  setup() {
    const cookie_ids = ref([]);

    const fetchUserData = async () => {
      try {
        const userData = await get_user_data_api();
        if (userData) {
            cookie_ids.value = userData.user.cookie_ids || '';
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

    onMounted(() => {
      fetchUserData();
    });

    return {
      cookie_ids
    };
  }
};
</script>