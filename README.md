# LearnWordGame

LearnWordGame, "6 sefer tekrar" prensibine dayanan bir kelime ezberleme sistemi olarak kurgulanmış bir okul projesidir. Depoda şu anda bir ASP.NET Core backend, bir Expo/React Native frontend ve birkaç bağımsız deneme projesi bulunur. Bu README, hem mevcut kodun ne yaptığını hem de PDF'teki gereksinimlere göre projeyi nasıl tamamlamak gerektiğini açıklar.

## Projenin Amacı

Hedef, öğrencinin İngilizce kelimeleri zamana yayılmış tekrarlarla öğrenmesini sağlamaktır. Bir kelime, farklı zaman aralıklarında toplam 6 kez doğru bilinirse "öğrenildi" kabul edilir. Bu mantık sınav modülü, raporlama ve oyunlaştırma modülleri ile desteklenir.

PDF'teki ana fikir:

- Kullanıcı kayıt, giriş ve şifre yenileme akışı
- Kelime, örnek cümle, görsel ve opsiyonel ses desteği
- 6 tekrar kuralına göre sınav akışı
- Kullanıcı ayarları
- Analiz ve raporlama
- Bonus olarak Wordle benzeri modül
- Bonus olarak LLM ile hikaye ve görsel üretimi
- Bonus olarak mobil uygulama

## Repo Yapısı

### `Backend/`

ASP.NET Core Web API projesi.

- `Backend/Backend/Program.cs`: servis kayıtları, CORS, EF Core, controller setup
- `Backend/Backend/Controllers/UserController.cs`: kayıt ve giriş işlemleri
- `Backend/Backend/Data/AppDbContext.cs`: veritabanı context'i
- `Backend/Backend/Models/`: `User`, `Word`, `WordSample` modelleri
- `Backend/Backend/Migrations/`: mevcut migration dosyaları
- `Backend/Backend/Utility/`: SHA256,EmailService,ReserPasswordCode... gibi yardımcı servisler

### `react-native-frondend/`

Expo tabanlı mobil istemci.

- `app/_layout.tsx`: root layout
- `app/(tabs)/_layout.tsx`: tab yapısı
- `app/(tabs)/index.tsx`: şu anda kayıt ekranı benzeri deneme ekranı
- `app/(tabs)/explore.tsx`: çoğunlukla Expo starter içeriği
- `frontendDeneme.js`: bağımsız login denemesi


## Kullanılan Teknolojiler

### Backend

- .NET 9
- ASP.NET Core Web API
- Entity Framework Core
- Microsoft SQL Server
- OpenAPI

### Frontend

- React Native
- Expo
- Expo Router
- TypeScript
- React 19

## Docker ile Çalıştırma

Projeyi ekip içinde aynı sürümlerle ayağa kaldırmak için kök klasörde çalıştırın:

```bash
cp .env.example .env
docker compose up --build
```

Bu komut üç servisi başlatır:

- `db`: SQL Server 2022, verileri `sqlvolume` Docker volume'unda tutar
- `backend`: ASP.NET Core API, host makinede `http://localhost:5000`
- `mobile`: Expo geliştirme sunucusu, host makinede `http://localhost:8081`

Android emulator backend'e `http://10.0.2.2:5000` üzerinden ulaşır. iOS simulator ve web için varsayılan adres `http://localhost:5000` olur. Fiziksel telefonda Expo QR ile test ederken `.env` içindeki `EXPO_PUBLIC_API_URL` değerini bilgisayarınızın yerel ağ IP adresiyle değiştirin:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.25:5000
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.25
```

Docker backend ve veritabanı sürüm farklılıklarını büyük ölçüde çözer. Mobil tarafta ise Expo Go / emulator / cihaz SDK uyumu hâlâ önemlidir; bu yüzden Node ve npm bağımlılıkları Docker içinde sabitlense bile fiziksel cihazdaki Expo sürümünün proje SDK'sı ile uyumlu olması gerekir.

## Mevcut Durum

Şu an backend tarafında temel kullanıcı kayıt ve giriş mantığı var. Frontend tarafında ise ürün akışından çok başlangıç şablonu ve deneme ekranları bulunuyor. Yani proje fikri net, fakat PDF'teki tüm story'leri karşılayan ürün henüz tamamlanmış değil.

## PDF Gereksinimleri

PDF dosyası: `6 Sefer tekrar prensibi içeren kelime ezberleme oyunu.pdf`

### Story 1: Kullanıcı Modülü

Beklenenler:

- Kullanıcı kaydı
- Giriş
- Şifremi unuttum akışı
- Sistemi kimlerin kullanacağı tanımı

PDF'te verilen temel tablo:

- `Users`
  - `UserID`
  - `UserName`
  - `Password`

### Story 2: Kelime Ekleme Modülü

Beklenenler:

- İngilizce kelime
- Türkçe karşılık
- Birden fazla örnek cümle
- Kelime için görsel
- Opsiyonel ses desteği

PDF'te verilen temel tablolar:

- `Words`
  - `WordID`
  - `EngWordName`
  - `TurWordName`
  - `Picture`
- `WordSamples`
  - `WordSamplesID`
  - `WordID`
  - `Samples`

### Story 3: Sınav Modülü

Ana kural:

- Bir kelime gerçekten öğrenilmiş sayılmadan önce 6 farklı tekrar aşamasında doğru bilinmeli
- Eğer öğrenci bu akışta bir noktada yanlış yaparsa süreç o kelime için başa dönmeli

PDF'te belirtilen tekrar mantığı:

- İlk doğru cevap sonrası tekrar
- 1 gün sonra
- 1 hafta sonra
- 1 ay sonra
- 3 ay sonra
- 6 ay sonra
- 1 yıl sonra

Not:

- PDF metni "6 kez doğru bilme" mantığını anlatıyor, ama örneklerde tarih akışında yazım hataları var
- Uygulamada bunu netleştirip teknik olarak tek bir "spaced repetition" kuralı halinde modellemek gerekir

### Story 4: Ayarlar

Kullanıcı şunları ayarlayabilmeli:

- Günlük yeni kelime sayısı
- Günlük sınav/karşılaşma sayısı

### Story 5: Analiz ve Rapor

Beklenenler:

- Öğrenilen kelimeler üzerinden analiz
- Yüzdesel başarı oranı
- İstenirse çıktı alınabilecek rapor yapısı

### Ek İstekler

PDF'in son sayfalarında görünen ek istekler:

- Story 6: Öğrenilen kelimelerle Wordle benzeri bulmaca
- Story 7: Word chain / LLM destekli hikaye ve görsel üretimi
- Bonus: Uygulamanın mobil olarak da çalışması
- Opsiyonel: zorluk seviyesi, boş bırakılan sorular, farklı soru formatları, AI görsel üretimi

## Teknik Yorum

Bu projeyi düzgün tamamlamak için backend ve frontend görevlerini net ayırmak gerekir.

### Backend'in Sorumluluğu

Backend sadece kullanıcı ve kelime CRUD'u değil, aynı zamanda tekrar algoritmasının kaydını da yönetmelidir.

Backend tarafında olması gereken ana sorumluluklar:

- Kimlik doğrulama
- Kelime ve örnek cümle yönetimi
- Kullanıcının hangi kelimeyi hangi aşamada öğrendiğini takip etme
- O gün kullanıcıya hangi kelimelerin sorulacağını hesaplama
- Test sonucu kaydetme
- Rapor üretme
- İleride Wordle ve LLM modülleri için veri sağlama

### Frontend'in Sorumluluğu

Frontend'in işi veri kuralı koymak değil, backend'in ürettiği akışı kullanıcıya sunmaktır.

Frontend tarafında olması gereken ana ekranlar:

- Login
- Register
- Forgot password
- Dashboard
- Günlük tekrar ekranı
- Yeni kelime ekranı
- Kelime detay ekranı
- Ayarlar ekranı
- Rapor ekranı
- Wordle ekranı
- Opsiyonel LLM hikaye ekranı

### Backend'de ki tüm ENDPOİNTLER

- `POST /api/User/login`
```http
POST http://localhost:5000/api/User/login
Content-Type: application/json

{
  "userName": "ayse",
  "password": "Secret123!"
}
```


- `POST http://localhost:5000/api/User/register`
```http
POST http://localhost:5000/api/User/register
Content-Type: application/json

{
  "userName": "ayse",
  "password": "Secret123!",
  "email": "ayse@example.com"
}
```

  
- `POST /api/User/forgot-password`
```http
POST http://localhost:5000/api/User/forgot-password?usernameOrEmail=ayse@example.com
```

- `POST /api/User/reset-password`
```http
POST http://localhost:5000/api/User/reset-password
Content-Type: application/json

{
  "userNameOrEmail": "ayse@example.com",
  "code": 123456,
  "newPassword": "NewSecret123!"
}
```

- 
- `POST /api/User/refresh`
```http
POST http://localhost:5000/api/User/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

  
- `PUT /api/User/profile/daily-words`
```http
PUT http://localhost:5000/api/User/profile/daily-words
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "dailyNewWords": 10
}
```


- `PUT /api/User/profile/users-level-update`
```http
PUT http://localhost:5000/api/User/profile/users-level-update
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "level": "A2"
}
```


- `GET /api/User/profile`
```http
GET http://localhost:5000/api/User/profile
Authorization: Bearer <accessToken>
```


- `POST /api/Word/add`
```http
POST http://localhost:5000/api/Word/add
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "engWordName": "book",
  "turWordName": "kitap",
  "level": "FromUsers"
}
```

  
- `GET /api/Word/get-myword`
```http
GET http://localhost:5000/api/Word/get-myword
Authorization: Bearer <accessToken>
```

  
- `GET /api/Word/daily-word`
```http
GET http://localhost:5000/api/Word/daily-word
Authorization: Bearer <accessToken>
```


- `POST /api/Word/test-result`
```http
POST http://localhost:5000/api/Word/test-result
Authorization: Bearer <accessToken>
Content-Type: application/json

[
  {
    "wordId": 12,
    "isCorrect": true
  },
  {
    "wordId": 13,
    "isCorrect": false
  }
]
```


- `GET /api/Wordle/new-game`
```http
GET http://localhost:5000/api/Wordle/new-game
Authorization: Bearer <accessToken>
```


- `GET /api/WordChain/get-word-chain`
```http
GET http://localhost:5000/api/WordChain/get-word-chain
Authorization: Bearer <accessToken>
```
  
- `GET /api/Analysis/report`
```http
GET http://localhost:5000/api/Analysis/report
Authorization: Bearer <accessToken>
```


## Frontend'de Yapılması Gerekenler

### 1. Mevcut starter ekranlarını kaldırmak

Şu an frontend'in önemli kısmı Expo örnek ekranı halinde. Önce ürün ekranlarına geçmek gerekir.

İlk düzenlenecek dosyalar:

- `react-native-frondend/app/(tabs)/index.tsx`
- `react-native-frondend/app/(tabs)/explore.tsx`
- `react-native-frondend/app/(tabs)/_layout.tsx`

### 2. Auth akışı

Yapılacak ekranlar:

- login
- register
- forgot password

Frontend tarafında yapılacaklar:

- form validation
- loading state
- hata mesajları
- token saklama
- giriş sonrası dashboard yönlendirmesi

### 3. Dashboard

Dashboard üzerinde görünmesi gerekenler:

- bugün kaç yeni kelime var
- bugün kaç tekrar var
- başarı oranı
- öğrenilen toplam kelime
- "bugünkü teste başla" butonu

### 4. Günlük test ekranı

Test ekranında olması gerekenler:

- kelime gösterimi
- çoktan seçmeli veya yazmalı cevap
- doğru/yanlış geri bildirimi
- ilerleme çubuğu
- oturum sonu özet

### 5. Kelime yönetimi ekranları

Öğretmen/admin veya içerik yöneten kullanıcı için:

- kelime listeleme
- yeni kelime ekleme
- örnek cümle ekleme
- görsel yükleme

### 6. Ayarlar ekranı

Burada kullanıcı şunları değiştirebilmeli:

- günlük yeni kelime sayısı
- günlük soru sayısı
- opsiyonel zorluk seviyesi

### 7. Rapor ekranı

Burada gösterilecekler:

- öğrenme yüzdesi
- stage bazlı dağılım
- son 7 gün başarı trendi
- hangi kelimelerde zorlandığı

### 8. Wordle ekranı

Wordle modülü yapılacaksa:

- günün kelimesi için tahmin alanı
- harf bazlı geri bildirim
- önceki tahminler listesi

### 9. LLM ekranı

Bonus modül yapılırsa:

- seçilen kelimeler
- üretilen hikaye
- üretilen görsel

## API Tasarım Önerisi

Önerilen ana route grupları:

- `/api/auth`
- `/api/words`
- `/api/study`
- `/api/reports`
- `/api/settings`
- `/api/wordle`
- `/api/llm`

Örnek istekler:

```http
POST /api/auth/register
Content-Type: application/json

{
  "userName": "oguzhan",
  "password": "secret123"
}
```

```http
GET /api/study/today
Authorization: Bearer <token>
```

```http
POST /api/study/submit-answer
Content-Type: application/json
Authorization: Bearer <token>

{
  "wordId": 12,
  "answer": "kitap",
  "isCorrect": true,
  "quizSessionId": 5
}
```

## Yol Haritası

Projeyi bu sırayla geliştirmek en mantıklı yaklaşım olur.

### Faz 1: Temel Temizlik

- frontend starter ekranlarını kaldır
- auth endpoint'lerini düzenle
- query string yerine request body kullan
- `.env` tabanlı konfigürasyon düzeni kur
- README ve kurulum notlarını netleştir

### Faz 2: Kelime Yönetimi

- `Word` ve `WordSample` CRUD
- görsel yükleme
- admin kelime ekleme ekranı

### Faz 3: Tekrar Algoritması

- `WordProgress` modeli
- tekrar zamanlama servisi
- günlük soru üretimi
- cevap gönderme ve stage güncelleme

### Faz 4: Kullanıcı Deneyimi

- dashboard
- günlük test akışı
- ayarlar ekranı
- rapor ekranı

### Faz 5: Bonus Modüller

- Wordle
- LLM hikaye ve görsel üretimi
- gelişmiş istatistikler

## Önceliklendirme

Teslim açısından minimum çalışan ürün için önce şu parçalar bitmeli:

1. Kullanıcı kaydı ve giriş
2. Kelime ekleme
3. 6 tekrar kuralına göre test modülü
4. Ayarlar
5. Analiz raporu

Sonra:

1. Wordle
2. LLM modülü
3. ek opsiyonel özellikler

## Ortam Değişkenleri

Bu repo içinde örnek ortam dosyaları oluşturulmuştur:

- `.env.example`
- `Backend/.env.example`
- `react-native-frondend/.env.example`

Amaç:

- veritabanı bağlantı bilgisini koddan ayırmak
- frontend API URL'ini hardcode etmeyi bırakmak

## Çalıştırma

### Backend

Gereksinimler:

- .NET SDK 9
- SQL Server

Çalıştırma:

```bash
cd Backend/Backend
dotnet run
```

Varsayılan adresler:

- `http://localhost:5184`
- `https://localhost:7047`

### Frontend

Gereksinimler:

- Node.js
- npm

Çalıştırma:

```bash
cd react-native-frondend
npm install
npm start
```

Alternatifler:

```bash
npm run android
npm run ios
npm run web
```

## Notlar

- Frontend klasör adı şu anda `react-native-frondend` olarak yazılmış; ileride `frontend` veya `mobile` gibi daha temiz bir isim tercih edilebilir
- Backend'de mevcut auth yapısı başlangıç seviyesinde, üretim seviyesi değildir
- PDF'teki tarih örneklerinde yazım/tarih kaymaları var; teknik uygulamada tekrar algoritmasını tek bir net kurala bağlamak gerekir
