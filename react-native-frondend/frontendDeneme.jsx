import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const API_BASE = 'https://localhost:7047/api/words'; //  backend portu

export default function LearnWordApp() {
  // Story 2 State'leri
  const [engWord, setEngWord] = useState('');
  const [turWord, setTurWord] = useState('');
  const [samples, setSamples] = useState(['']); // Birden çok örnek cümle
  const [image, setImage] = useState(null);

  // Story 3 State'leri
  const [quizWord, setQuizWord] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // --- STORY 2: KELİME EKLEME ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const saveWord = async () => {
    const formData = new FormData();
    formData.append('EngWordName', engWord);
    formData.append('TurWordName', turWord);
    formData.append('Samples', JSON.stringify(samples));
    if (image) {
      formData.append('Picture', { uri: image, name: 'word.jpg', type: 'image/jpeg' } );
    }

    try {
      const res = await fetch(`${API_BASE}/save`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.ok) {
        Alert.alert("Başarılı", "Kelime ve örnek cümleler kaydedildi!");
        setEngWord(''); setTurWord(''); setSamples(['']); setImage(null);
      }
    } catch (err) { Alert.alert("Hata", "Bağlantı kurulamadı."); }
  };

  // --- STORY 3: SINAV MODÜLÜ ALGORİTMASI ---
  const fetchQuizWord = async () => {
    try {
      const res = await fetch(`${API_BASE}/next-quiz`); // Tarihi gelen kelimeyi getirir
      const data = await res.json();
      setQuizWord(data);
      setShowAnswer(false);
    } catch (err) { console.log("Sınav kelimesi yok veya hata."); }
  };

  const handleQuizResult = async (isCorrect) => {
    try {
      await fetch(`${API_BASE}/update-level`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId: quizWord.id, isCorrect })
      });
      fetchQuizWord(); // Sıradaki kelimeye geç
    } catch (err) { Alert.alert("Hata", "Seviye güncellenemedi."); }
  };

  return (
    <ScrollView style={styles.container}>
      {/* STORY 2 ARAYÜZÜ */}
      <View style={styles.section}>
        <Text style={styles.header}>Kelime Ekle (Story 2)</Text>
        <TextInput style={styles.input} placeholder="İngilizce Kelime" value={engWord} onChangeText={setEngWord} />
        <TextInput style={styles.input} placeholder="Türkçe Karşılığı" value={turWord} onChangeText={setTurWord} />
        
        {samples.map((s, i) => (
          <TextInput key={i} style={styles.input} placeholder={`Örnek Cümle ${i+1}`} 
            onChangeText={(text) => {
              const newSamples = [...samples];
              newSamples[i] = text;
              setSamples(newSamples);
            }} 
          />
        ))}
        <TouchableOpacity onPress={() => setSamples([...samples, ''])}><Text style={{color: 'blue'}}>+ Cümle Ekle</Text></TouchableOpacity>

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text>Resim Seç</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        
        <TouchableOpacity style={styles.saveBtn} onPress={saveWord}><Text style={styles.btnText}>KAYDET</Text></TouchableOpacity>
      </View>

      {/* STORY 3 ARAYÜZÜ */}
      <View style={styles.section}>
        <Text style={styles.header}>Sınav Modülü (Story 3)</Text>
        {quizWord ? (
          <View style={styles.quizCard}>
            <Text style={styles.quizEng}>{quizWord.engWordName}</Text>
            {quizWord.picture && <Image source={{uri: quizWord.picture}} style={styles.previewImage}/>}
            
            {showAnswer ? (
              <View>
                <Text style={styles.quizTur}>{quizWord.turWordName}</Text>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.correctBtn} onPress={() => handleQuizResult(true)}><Text>Biliyorum</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.wrongBtn} onPress={() => handleQuizResult(false)}><Text>Bilmiyorum</Text></TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.saveBtn} onPress={() => setShowAnswer(true)}><Text>Cevabı Gör</Text></TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity onPress={fetchQuizWord}><Text>Sınavı Başlat</Text></TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  section: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 3 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  imageBtn: { backgroundColor: '#ddd', padding: 10, alignItems: 'center', marginVertical: 10 },
  previewImage: { width: 100, height: 100, alignSelf: 'center', marginVertical: 10 },
  saveBtn: { backgroundColor: '#4CAF50', padding: 10, alignItems: 'center', borderRadius: 5 },
  btnText: { color: 'white', fontWeight: 'bold' },
  quizCard: { alignItems: 'center', padding: 10 },
  quizEng: { fontSize: 24, fontWeight: 'bold' },
  quizTur: { fontSize: 20, color: 'green', marginVertical: 10 },
  row: { flexDirection: 'row', gap: 10 },
  correctBtn: { backgroundColor: '#8bc34a', padding: 10, borderRadius: 5 },
  wrongBtn: { backgroundColor: '#f44336', padding: 10, borderRadius: 5 }
});