import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.XX:8000/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Hoş geldin " + username);
      } else {
        Alert.alert("Hata", data.detail || "Giriş yapılamadı");
      }
    } catch (error) {
      Alert.alert("Bağlantı Hatası", "Backend sunucusuna ulaşılamıyor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kelime Ezberle</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Kullanıcı Adı" 
        onChangeText={setUsername}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Şifre" 
        secureTextEntry 
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {/* Şifremi unuttum kısmı */}}>
        <Text style={styles.forgotText}>Şifremi Unuttum</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  forgotText: { color: '#007AFF', textAlign: 'center', marginTop: 15 }
});