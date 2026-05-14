const API_URL = 'http://localhost:5184/api'; 

export const wordService = {
  // Story 2: Kelime Kaydetme
  saveWord: async (formData: FormData) => {
    return await fetch(`${API_URL}/words/save`, { method: 'POST', body: formData });
  },

  // Story 3 & 4: Sınav Sorusu ve Cevap Kontrolü
  getNextQuiz: async () => {
    const res = await fetch(`${API_URL}/words/next-quiz`);
    return await res.json();
  },

  // Story 5: İstatistikleri Getir (Yeni!)
  getStatistics: async () => {
    const res = await fetch(`${API_URL}/user/stats`);
    return await res.json(); 
  }
};