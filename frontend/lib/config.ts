import { Platform } from 'react-native';

const DEFAULT_API_URL = 'http://localhost:5000';
const DEFAULT_ANDROID_API_URL = 'http://10.0.2.2:5000';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const getApiUrl = () => {
  const sharedUrl = process.env.EXPO_PUBLIC_API_URL;
  const platformUrl =
    Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_API_URL_ANDROID
      : Platform.OS === 'ios'
        ? process.env.EXPO_PUBLIC_API_URL_IOS
        : process.env.EXPO_PUBLIC_API_URL_WEB;

  return trimTrailingSlash(
    platformUrl || sharedUrl || (Platform.OS === 'android' ? DEFAULT_ANDROID_API_URL : DEFAULT_API_URL)
  );
};

const apiUrl = getApiUrl();

const config = {
  API_URL: apiUrl,
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
  SOCKET: {
    URL: apiUrl.replace(/^http/, 'ws'),
  },
};

export default config;
