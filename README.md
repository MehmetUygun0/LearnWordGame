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

### `react-native-frondend/`

Expo tabanlı mobil istemci.

- `app/_layout.tsx`: root layout
- `app/(tabs)/_layout.tsx`: tab yapısı
- `app/(tabs)/index.tsx`: şu anda kayıt ekranı benzeri deneme ekranı
- `app/(tabs)/explore.tsx`: çoğunlukla Expo starter içeriği
- `frontendDeneme.js`: bağımsız login denemesi

### `Learn/` ve `ConsoleApp1/`

Ana ürün akışının zorunlu parçası olmayan .NET console denemeleri.

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

## Backend'de Yapılması Gerekenler

### 1. Authentication katmanını düzeltmek

Mevcut durumda:

- `register` ve `login` var
- Şifre SHA-256 ile hashleniyor
- Şifremi unuttum yok
- Token bazlı auth yok

Yapılması gerekenler:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- Giriş sonrası token veya session mantığı
- Düz query string yerine JSON body kullanımı

### 2. Veri modelini büyütmek

Şu an mevcut modeller:

- `User`
- `Word`
- `WordSample`

Eklenmesi gereken modeller:

- `UserSettings`
- `WordProgress`
- `QuizSession`
- `QuizQuestion`
- `QuizAnswer`
- `DailyPlan`
- `PasswordResetToken`

Önerilen ek tablo mantığı:

- `UserSettings`
  - günlük yeni kelime sayısı
  - günlük tekrar sayısı
- `WordProgress`
  - `UserId`
  - `WordId`
  - `SuccessStage`
  - `NextReviewAt`
  - `LastReviewedAt`
  - `CorrectStreak`
  - `IsLearned`
- `QuizAnswer`
  - hangi kullanıcı
  - hangi kelime
  - doğru mu
  - hangi tarihte cevapladı
  - hangi tekrar aşamasındaydı

### 3. Kelime yönetimi modülü

Gereken endpoint'ler:

- `GET /api/words`
- `GET /api/words/{id}`
- `POST /api/words`
- `PUT /api/words/{id}`
- `DELETE /api/words/{id}`
- `POST /api/words/{id}/samples`
- `POST /api/words/{id}/image`
- `POST /api/words/{id}/audio`

### 4. 6 tekrar algoritması

Bu proje için kritik nokta budur.

Önerilen mantık:

1. Kullanıcıya önce yeni kelimeler tanımlanır.
2. Her kelime için `SuccessStage = 0` ile başlanır.
3. Kullanıcı doğru cevap verdikçe bir sonraki aşamaya geçilir.
4. Sonraki gösterim tarihi stage'e göre hesaplanır.
5. Kullanıcı yanlış cevap verirse stage sıfırlanır.
6. Son stage tamamlanınca kelime `IsLearned = true` olur.

Önerilen tekrar aralıkları:

- Stage 0 -> aynı gün veya öğrenme kaydı
- Stage 1 -> `+1 day`
- Stage 2 -> `+7 days`
- Stage 3 -> `+30 days`
- Stage 4 -> `+90 days`
- Stage 5 -> `+180 days`
- Stage 6 -> `+365 days`

Uygulamada karar:

- "İlk karşılaşma" ayrı bir öğrenme anı mı sayılacak, yoksa ilk doğru cevap stage 1 mi olacak?
- Bunu backend tarafında tek bir servis üzerinden standartlaştırmak gerekir

### 5. Günlük test planı üretme

Backend her gün kullanıcı için şu iki kaynaktan soru toplamalı:

- Bugün tekrarı gelen kelimeler
- Kullanıcının ayarına göre yeni eklenecek kelimeler

Gereken endpoint'ler:

- `GET /api/study/today`
- `POST /api/study/submit-answer`
- `POST /api/study/finish-session`

`GET /api/study/today` cevabı şu bilgileri dönmeli:

- bugün sorulacak kelimeler
- hangileri tekrar, hangileri yeni
- toplam soru sayısı
- cevap formatı

### 6. Raporlama

Gereken endpoint'ler:

- `GET /api/reports/progress`
- `GET /api/reports/learned-words`
- `GET /api/reports/success-rate`
- `GET /api/reports/printable`

Rapor içinde olması gereken veriler:

- toplam kelime
- öğrenilen kelime
- öğrenme aşamasında olan kelime
- başarı oranı
- günlük/haftalık performans

### 7. Wordle modülü

Wordle benzeri modül için backend'de gerekenler:

- öğrenilmiş kelimeler havuzu
- günlük kelime seçimi
- deneme kayıtları

Gereken endpoint'ler:

- `GET /api/wordle/today`
- `POST /api/wordle/guess`
- `GET /api/wordle/history`

### 8. LLM modülü

Bu modül bonus ama yapılacaksa backend'de ayrı tutulmalı.

Amaç:

- Kullanıcının öğrendiği kelimelerle kısa hikaye üretmek
- Hikayeye uygun görsel üretmek

Gereken yapı:

- prompt oluşturma servisi
- LLM çağrısı
- üretilen hikaye kaydı
- opsiyonel görsel URL veya dosya kaydı

Gereken endpoint'ler:

- `POST /api/llm/story`
- `GET /api/llm/story-history`

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
