// Import Vue
import { createApp } from 'vue';

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.vue';

// URL para o backend
import BASE_URL from '../../config-url.js';

// Router
import router from './router.js';

// Validate token with the server
export default async function validateToken(token) {
  try {
    const response = await fetch(`${BASE_URL}/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Token validated successfully:", result);
      return true;
    } else {
      console.error("Token validation failed:", await response.text());
      return false;
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

// Function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

// Subscribe to push notifications
async function subscribeToPushNotifications(registration, token) {
  const publicKey = "BISyZ7TodhG8Viez1H6rGRMSn4ZGO3Ji-Gy-9_-Ozzmecta-5KZ2VFuj5Z3y13Nm1zVSOPPgb_us7_61u2562bc";
  const applicationServerKey = urlBase64ToUint8Array(publicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  try {
    const response = await fetch(`${BASE_URL}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("User signed for push notifications", result);
    } else {
      console.error("Error at registering on server:", await response.text());
    }
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
  }
}

// Validate an existing subscription
async function validateSubscription(registration) {
  try {
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.warn("No subscription found on this device.");
      return false;
    }

    console.log("Current subscription found:", subscription);

    const response = await fetch(`${BASE_URL}/validate-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Subscription validated successfully:", result);
      return true;
    } 
    else {
      console.error("Failed to validate subscription:", await response.text());
      return false;
    }
  } 
  catch (error) {
    console.error("Error validating subscription:", error);
    return false;
  }
}

// Initialize Push Notifications
async function initializePushNotifications() {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker is not supported in this browser");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found. Notifications won't be initialized.");
    return;
  }

  const isTokenValid = await validateToken(token);
  if (!isTokenValid) {
    console.warn("Token validation failed. Notifications won't be initialized.");
    return;
  }

  navigator.serviceWorker.ready.then(async (registration) => {
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log("Validating existing subscription...");
      const validationResponse = await validateSubscription(registration);

      if (validationResponse) {
        return; // Subscrição válida, não cria outra
      } 
      else {
        console.warn("Existing subscription is not valid. Proceeding to create a new one.");
      }
    } 
    else {
      console.log("No existing subscription found. Proceeding to create a new one.");
    }

    // Cria uma nova subscrição caso nenhuma válida seja encontrada
    await subscribeToPushNotifications(registration, token);
  });
}


// Configuring PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// Configuring Push Notifications
if ("Notification" in window && "serviceWorker" in navigator) {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notifications activated");
      initializePushNotifications();
    } else {
      console.warn("Notifications permission denied.");
    }
  });
}

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
const app = createApp(App);

// Register Framework7 Vue components
registerComponents(app);

// Router
app.use(router);

// Mount the app
app.mount("#app");