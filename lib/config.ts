const API_URL = "http://localhost:5184";

export const config = {
  apiUrl: API_URL,
  endpoints: {
    auth: {
      login: "/login",
      register: "/register"
    },
    user: {
      profile: "/api/User/profile"
    },
    word: {
      add: "/api/Word/add"
    },
    wordle: {
      newGame: "/api/wordle/new-game",
      guess: "/api/wordle/guess"
    }
  }
};
