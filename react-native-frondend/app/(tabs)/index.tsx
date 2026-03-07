import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Platform, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  // 1. Eksik olan state'leri (durumları) tanımlıyoruz
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
const formData = new FormData();
formData.append('username', Username);
formData.append('password', Password);
  // 2. Eksik olan fonksiyonu tanımlıyoruz
  const handleRegister = async () => {
    try {
      const response = await fetch('https://localhost:7047/register', { // <--- buraya backend URL
        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Başarılı', 'Kayıt başarılı!');
      } else {
        const errorData = await response.json();
        Alert.alert('Hata', errorData.message || 'Kayıt başarısız!');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya ulaşılamıyor!');
      console.error(error);
    }
  };
  return (
    // 3. View ve ParallaxScrollView'u tek bir kapsayıcı (Fragment veya View) içine alıyoruz
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* Kayıt Formunu ParallaxScrollView içine taşıdık */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Kayıt Ol</ThemedText>
        <TextInput
          placeholder="Kullanıcı Adı"
          value={Username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Şifre"
          value={Password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#888"
        />
        <Button title="Kayıt Ol" onPress={handleRegister} />
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Merhaba!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Giriş Kısayolu</ThemedText>
        <ThemedText>
          Geliştirici menüsü için:{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>
        </ThemedText>
      </ThemedView>

      {/* Link ve diğer içerikler buraya devam edebilir... */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
    padding: 16,
  },
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});