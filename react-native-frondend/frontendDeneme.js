import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Platform, StyleSheet, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HelloWave } from '@/components/hello-wave';

export default function HomeScreen() {
  // --- STORY 1: AUTH STATE ---
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');

  // --- STORY 2: WORD & IMAGE STATE ---
  const [engWord, setEngWord] = useState(''); // İngilizce kelime
  const [turWord, setTurWord] = useState(''); // Türkçe karşılığı
  const [image, setImage] = useState<string | null>(null); // Resim yolu

  // --- STORY 2: RESİM SEÇME FONKSİYONU ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // State hatası burada düzeltildi
    }
  };

  // --- STORY 1 & 2: KAYDETME FONKSİYONU ---
  const handleSaveAll = async () => {
    // Resim ve veri gönderimi için FormData kullanıyoruz
    const formData = new FormData();
    formData.append('username', Username);
    formData.append('password', Password);
    formData.append('EngWordName', engWord); //
    formData.append('TurWordName', turWord); //

    if (image) {
      // Resim dosyasını FormData'ya ekliyoruz
      formData.append('Picture', {
        uri: image,
        name: 'word_image.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      // Backend terminalinde gördüğün C# portu (5184)
      const response = await fetch('https://localhost:7047', {
        method: 'POST',
        body: formData, // JSON yerine FormData gönderiyoruz
      });

      if (response.ok) {
        Alert.alert('Başarılı', 'Kayıt ve Kelime Ekleme İşlemi Tamamlandi!');
      } else {
        Alert.alert('Hata', 'İşlem başarısız oldu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'C# Backend sunucusuna ulaşılamıyor!');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* STORY 1: KAYIT BÖLÜMÜ */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Kullanıcı Bilgileri (Story 1)</ThemedText>
        <TextInput
          placeholder="Kullanıcı Adı"
          value={Username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Şifre"
          value={Password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </ThemedView>

      {/* STORY 2: KELİME EKLEME BÖLÜMÜ */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Kelime Ekle (Story 2)</ThemedText>
        <TextInput
          placeholder="İngilizce Kelime"
          value={engWord}
          onChangeText={setEngWord}
          style={styles.input}
        />
        <TextInput
          placeholder="Türkçe Karşılığı"
          value={turWord}
          onChangeText={setTurWord}
          style={styles.input}
        />
        
        <Button title="Galeriden Resim Seç" onPress={pickImage} color="#841584" />
        
        {/* Seçilen resmin önizlemesi */}
        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Button title="Tümünü Sisteme Kaydet" onPress={handleSaveAll} />
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Merhaba Furkan!</ThemedText>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  stepContainer: { gap: 8, marginBottom: 20, padding: 16 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
    marginVertical: 5,
  },
  reactLogo: { height: 178, width: 290, bottom: 0, left: 0, position: 'absolute' },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: 'cover',
  },
});