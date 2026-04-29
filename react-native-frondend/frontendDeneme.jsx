import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  ScrollView, StyleSheet, Alert, ActivityIndicator, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Backend bağlantı ayarı (Android emülatör için 10.0.2.2, iOS/Web için localhost)
const API_URL = 'http://localhost:5184';

export default function LearnWordApp() {
  // --- STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: '', password: '' });

  const [wordData, setWordData] = useState({
    ing: '',
    tr: '',
    samples: [''],
    image: null
  });

  const [quiz, setQuiz] = useState({ question: null, showAnswer: false });

  // --- STORY 1: GİRİŞ / KAYIT ---
  const handleLogin = async () => {
    if (!user.username || !user.password) {
      return Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
    }

    setLoading(true);
    try {
      
        const response = await fetch(`${API_URL}/user/register?username=${user.username}&password=${user.password}`, {
  method: 'POST'
});
        const res = await fetch(`${API_URL}/user/login?username=${user.username}&password=${user.password}`, { 
    method: 'GET' 
  });
      if (response.ok) {
        setIsLoggedIn(true);
        Alert.alert("Başarılı", `Hoş geldin, ${user.username}!`);
      } else {
        Alert.alert("Hata", "Kullanıcı adı veya şifre yanlış.");
      }
    } catch (error) {
      Alert.alert("Bağlantı Hatası", "Backend sunucusuna ulaşılamıyor. Sunucunun açık olduğundan emin olun.");
    } finally {
      setLoading(false);
    }
  };

  // --- STORY 2: KELİME EKLEME ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!result.canceled) {
      setWordData({ ...wordData, image: result.assets[0].uri });
    }
  };

  const handleSaveWord = async () => {
    if (!wordData.ing || !wordData.tr) return Alert.alert("Hata", "Kelime alanları boş olamaz.");

    const formData = new FormData();
    formData.append('EngWordName', wordData.ing);
    formData.append('TurWordName', wordData.tr);
    formData.append('Samples', JSON.stringify(wordData.samples.filter(s => s.trim() !== '')));
    
    if (wordData.image) {
      formData.append('Picture', {
        uri: wordData.image,
        name: 'upload.jpg',
        type: 'image/jpeg',
      });
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/words/save`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.ok) {
        Alert.alert("Başarılı", "Kelime sisteme kaydedildi.");
        setWordData({ ing: '', tr: '', samples: [''], image: null });
      }
    } catch (error) {
      Alert.alert("Hata", "Kelime kaydedilemedi.");
    } finally {
      setLoading(false);
    }
  };

  // --- STORY 3: SINAV ---
  const getNextQuestion = async () => {
    try {
      const response = await fetch(`${API_URL}/words/next-quiz`);
      const data = await response.json();
      setQuiz({ question: data, showAnswer: false });
    } catch (error) {
      Alert.alert("Bilgi", "Sıradaki soru bulunamadı.");
    }
  };

  // --- RENDER (GİRİŞ) ---
  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.logo}>LearnWord</Text>
        <View style={styles.loginCard}>
          <TextInput 
            style={styles.input} 
            placeholder="Kullanıcı Adı" 
            autoCapitalize="none"
            onChangeText={(val) => setUser({...user, username: val})}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Şifre" 
            secureTextEntry 
            onChangeText={(val) => setUser({...user, password: val})}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>GİRİŞ YAP</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- RENDER (ANA PANEL) ---
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.welcome}>Merhaba, {user.username} 👋</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Yeni Kelime Ekle</Text>
        <TextInput 
          style={styles.input} 
          placeholder="İngilizce" 
          value={wordData.ing}
          onChangeText={(t) => setWordData({...wordData, ing: t})}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Türkçe Anlamı" 
          value={wordData.tr}
          onChangeText={(t) => setWordData({...wordData, tr: t})}
        />
        
        <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
          <Text>{wordData.image ? "Resmi Değiştir" : "Görsel Seç"}</Text>
        </TouchableOpacity>
        
        {wordData.image && <Image source={{ uri: wordData.image }} style={styles.preview} />}
        
        <TouchableOpacity style={styles.successBtn} onPress={handleSaveWord}>
          <Text style={styles.btnText}>VERİTABANINA KAYDET</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kelime Sınavı</Text>
        {quiz.question ? (
          <View style={styles.quizBox}>
            <Text style={styles.wordMain}>{quiz.question.engWordName}</Text>
            {quiz.showAnswer && <Text style={styles.wordSub}>{quiz.question.turWordName}</Text>}
            
            {!quiz.showAnswer ? (
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setQuiz({...quiz, showAnswer: true})}>
                <Text style={styles.btnText}>Cevabı Gör</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.primaryBtn} onPress={getNextQuestion}>
                <Text style={styles.btnText}>Sıradaki Kelime</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.secondaryBtn} onPress={getNextQuestion}>
            <Text>Sınavı Başlat</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loginContainer: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#212529' },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 40 },
  loginCard: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 10 },
  welcome: { fontSize: 24, fontWeight: '700', margin: 20, color: '#333' },
  card: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 20, padding: 20, borderRadius: 15, elevation: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#495057' },
  input: { backgroundColor: '#F1F3F5', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  primaryBtn: { backgroundColor: '#007BFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  secondaryBtn: { borderWidth: 1, borderColor: '#DEE2E6', padding: 12, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  successBtn: { backgroundColor: '#28A745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  preview: { width: '100%', height: 180, borderRadius: 10, marginVertical: 10 },
  quizBox: { alignItems: 'center' },
  wordMain: { fontSize: 32, fontWeight: 'bold', color: '#212529', marginBottom: 10 },
  wordSub: { fontSize: 24, color: '#28A745', fontWeight: '600', marginBottom: 20 }
});