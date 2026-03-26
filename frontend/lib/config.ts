// @ts-nocheck
const DEV_MODE = true;
const DEV_IP = '192.168.1.102'; //Kendi ip adresinizi kopyalayıp yapıştırın '' arasına

const config = {
  // Geliştirme ortamında ekipte herkes kendi IP'sini buradan yönetiyor.
  API_URL: DEV_MODE ? `http://${DEV_IP}:5001` : 'https://production-api.com',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/register',
      LOGIN: '/login',
      DELETE: '/api/auth/delete',
    },
    USER: {
      INFO: '/api/user/info',
      SAVE_PUSH_TOKEN: '/api/user/save-push-token',
    },
    INFO: {
      DASHBOARD: '/api/info/dashboard',
    },
    STUDY: {
      TODAY: '/api/study/today',
      SUBMIT_ANSWER: '/api/study/submit-answer',
    },
    REPORT: {
      PROGRESS: '/api/reports/progress',
    },
    CHAT: {
      CONVERSATIONS: '/api/chat/conversations',
      DETAIL: '/api/chat/detail',
      SEND: '/api/chat/send',
    },
  },
  // Şimdilik socket akışı aktif değil ama ileride canlı özellikler için hazır tutuluyor.
  SOCKET: {
    URL: DEV_MODE ? `ws://${DEV_IP}:5001` : 'wss://production-api.com',
  },
};

export default config;
