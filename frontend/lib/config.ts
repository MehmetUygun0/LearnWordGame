// @ts-nocheck
const DEV_MODE = true;
const DEV_IP = 'localhost'; //Kendi ip adresinizi kopyalayıp yapıştırın '' arasına

const config = {
  // Geliştirme ortamında ekipte herkes kendi IP'sini buradan yönetiyor.
  API_URL: DEV_MODE ? `http://${DEV_IP}:5184` : 'https://production-api.com',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/User/register',
      LOGIN: '/api/User/login',
      FORGOT_PASSWORD: '/api/User/forgot-password',
      RESET_PASSWORD: '/api/User/reset-password',
      REFRESH: '/api/User/refresh',
      PROFILE: '/api/User/profile',
    },
    WORDS: {
      ADD: '/api/Word/add',
    },
  },
  // Şimdilik socket akışı aktif değil ama ileride canlı özellikler için hazır tutuluyor.
  SOCKET: {
    URL: DEV_MODE ? `ws://${DEV_IP}:5001` : 'wss://production-api.com',
  },
};

export default config;
