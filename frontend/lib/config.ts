// @ts-nocheck
const DEV_MODE = true;
const DEV_IP = '192.168.1.102'; //Kendi ip adresinizi kopyalayıp yapıştırın '' arasına

const config = {
  // Geliştirme ortamında ekipte herkes kendi IP'sini buradan yönetiyor.
  API_URL: DEV_MODE ? `http://${DEV_IP}:5001` : 'https://production-api.com',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      ME: '/api/auth/me',
    },
    WORDS: {
      LIST: '/api/words',
    },
  },
  // Şimdilik socket akışı aktif değil ama ileride canlı özellikler için hazır tutuluyor.
  SOCKET: {
    URL: DEV_MODE ? `ws://${DEV_IP}:5001` : 'wss://production-api.com',
  },
};

export default config;
