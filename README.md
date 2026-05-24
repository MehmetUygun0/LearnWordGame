# LearnWordGame

LearnWordGame, "6 sefer tekrar" prensibine dayanan bir kelime ezberleme sistemi olarak kurgulanmış bir okul projesidir. Depoda şu anda bir ASP.NET Core backend ve Expo/React Native frontend bulunur. Bu README, mevcut kodun son durumunu, kullanılan endpoint'leri ve PDF'teki gereksinimlere göre kalan işleri özetler.

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

### `frontend/`

Expo Router tabanlı aktif mobil istemci.

- `frontend/app/(auth)/`: login, register, forgot-password ve reset-password ekranları
- `frontend/app/(app)/`: home, study, words, report, settings, wordle ve word-chain ekranları
- `frontend/services/`: backend ile konuşan servis katmanı
- `frontend/lib/config.ts`: API URL ve endpoint sabitleri
- `frontend/lib/auth-context.tsx`: token saklama, refresh ve oturum yönetimi

### `react-native-frondend/`

Eski/deneme Expo klasörü. Aktif ürün geliştirmesi `frontend/` altında ilerler.


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

Şu an backend tarafında auth, profil, kelime, günlük çalışma, test sonucu, analiz raporu, Wordle ve Word Chain endpoint'leri bulunur. Frontend tarafında bu endpoint'lere bağlanan ürün ekranları vardır. PDF'teki ana story'ler için akış kurulmuştur; ancak aşağıdaki "Kalan Kritik İşler" bölümündeki backend mantık düzeltmeleri yapılmadan proje tamamen doğru kabul edilmemelidir.

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
  "accessToken": "<accessToken>",
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
  "level": "A1",
  "picture": null,
  "samples": [
    "This book is new."
  ]
}
```

  
- `GET /api/Word/get-myword`
```http
GET http://localhost:5000/api/Word/get-myword
Authorization: Bearer <accessToken>
```

  
- `POST /api/Word/daily-word`
```http
POST http://localhost:5000/api/Word/daily-word
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


## Frontend Son Durumu

Aktif frontend `frontend/` klasöründedir ve PDF'teki ana ekranlar ürün akışı olarak hazırlanmıştır.

- Auth ekranları backend auth endpoint'lerine bağlıdır.
- Home/dashboard ekranı profil ve çalışma özetini gösterir.
- Study ekranı `POST /api/Word/daily-word` ile günlük kelimeleri alır ve `POST /api/Word/test-result` ile sonucu kaydeder.
- Words ekranı kullanıcının kelimelerini listeler ve `POST /api/Word/add` ile yeni kelime gönderir.
- Settings ekranı günlük yeni kelime sayısını ve seviyeyi backend'e kaydeder.
- Report ekranı `GET /api/Analysis/report` üzerinden rapor verisini okur.
- Wordle ekranı `GET /api/Wordle/new-game` üzerinden kelime alır.
- Word Chain ekranı `GET /api/WordChain/get-word-chain` üzerinden hikaye ve görsel çıktısını gösterir.

Frontend servisleri backend erişilemediğinde veya eksik veri döndüğünde ekranların tamamen kırılmaması için demo/fallback havuzuna düşer. Bu fallback teslim demosunu kolaylaştırır; gerçek değerlendirmede backend'in doğru veri üretmesi gerekir.

## PDF'e Göre Kalan Kritik İşler

Bu bölüm tamamlanmadan proje PDF isterleri açısından tamamen bitmiş sayılmamalıdır.

1. 6 tekrar zamanlama algoritması PDF ile aynı olmalı:
   - 1 gün
   - 1 hafta
   - 1 ay
   - 3 ay
   - 6 ay
   - 1 yıl

2. `POST /api/Word/daily-word` boş tekrar listesinde hata vermemeli.

3. `POST /api/Word/add` PDF'teki kelime modelini tam kaydetmeli:
   - İngilizce kelime
   - Türkçe karşılık
   - seviye
   - birden fazla örnek cümle
   - görsel
   - opsiyonel ses alanı

4. `POST /api/Word/test-result` sonucu `WordId` bazlı eşleştirmeli. Veritabanından gelen sıra ile request sırası aynı varsayılmamalı.

5. Wordle PDF'e göre öğrenilen kelimelerden seçilmeli. Bunun için `UserWordProgress.IsLearned == true` filtresi gerekir.

6. Word Chain de öğrenilen kelimelerden veya en azından kullanıcının gerçek çalışma havuzundan seçilmeli. Görselin uygulama içinde kalıcı kaydı netleştirilmeli.

7. Rapor ekranı için gerçek çıktı/print/export akışı eklenmeli. PDF "kağıt üzerinden çıktı alınabilsin" isterini açıkça söylüyor.

## Önceliklendirme

Teslim açısından önce düzeltilmesi gerekenler:

1. Backend 6 tekrar algoritması
2. `daily-word` boş liste hatası
3. kelime eklemede örnek cümle/görsel/seviye kaydı
4. test sonucu kaydında `WordId` bazlı eşleştirme
5. Wordle ve Word Chain için öğrenilen kelime filtresi
6. rapor export/print

## Ortam Değişkenleri

Bu repo içinde örnek ortam dosyaları oluşturulmuştur:

- `.env.example`
- `Backend/.env.example`
- `frontend/.env.example`

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
cd frontend
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

- Aktif frontend klasörü `frontend/` dizinidir. `react-native-frondend/` eski deneme klasörü olarak tutuluyorsa ürün akışında referans alınmamalıdır
- Backend'de mevcut auth yapısı başlangıç seviyesinde, üretim seviyesi değildir
- PDF'teki tarih örneklerinde yazım/tarih kaymaları var; teknik uygulamada tekrar algoritmasını tek bir net kurala bağlamak gerekir
