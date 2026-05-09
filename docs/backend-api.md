# Backend API Dökümanı

Bu doküman, repodaki mevcut backend controller ve DTO'lara göre hazırlanmıştır.

Amaç:
- Şu an gerçekten var olan endpoint'leri netleştirmek
- Frontend'in bugün hangi uçlarla entegre olabileceğini göstermek
- Story 2, 3, 4 ve 5 için backend'de eksik kalan API ihtiyaçlarını görünür kılmak

## Genel Bilgiler

- Backend teknoloji: ASP.NET Core Web API
- Auth tipi: JWT access token + refresh token
- Route yapısı:
  - `api/User/*`
  - `api/Word/*`
- Protected endpoint'lerde `Authorization: Bearer <token>` header'ı gerekir

## 1. Auth API

### `POST /api/User/register`

Yeni kullanıcı oluşturur.

Request body:

```json
{
  "userName": "oguzhan",
  "password": "123456",
  "email": "oguzhan@example.com"
}
```

Mevcut response:

- `200 OK`
- body dönmüyor

Not:
- Backend şu an register sonrası otomatik token dönmüyor
- Frontend register sonrası ayrıca login çağrısı yapıyor

### `POST /api/User/login`

Kullanıcı girişini yapar ve token çifti döner.

Request body:

```json
{
  "userName": "oguzhan",
  "password": "123456"
}
```

Success response:

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

Olası hata cevapları:

```json
{
  "message": "Kullanıcı bulunamadı."
}
```

veya düz string:

```text
Şifre hatalı.
```

Not:
- Hata formatı her endpoint'te tutarlı değil
- Frontend bu yüzden hem JSON hem string response okuyacak şekilde yazıldı

### `POST /api/User/forgot-password?usernameOrEmail=...`

Şifre sıfırlama kodu üretir ve e-posta gönderir.

Request:

```http
POST /api/User/forgot-password?usernameOrEmail=oguzhan@example.com
```

Success response:

```text
Sıfırlama kodu mail adresine gönderildi.
```

Olası hata:

```json
{
  "message": "Kullanıcı bulunamadı."
}
```

Not:
- DTO dosyasında `ForgotPasswordDto` var ama controller query param kullanıyor

### `POST /api/User/reset-password`

Mail ile gelen kod kullanılarak yeni şifre belirlenir.

Request body:

```json
{
  "userNameOrEmail": "oguzhan@example.com",
  "code": 123456,
  "newPassword": "yeniSifre123"
}
```

Success response:

```text
Şifren başarıyla sıfırlandı. Yeni şifrenle giriş yapabilirsin!
```

Olası hata cevapları:

```text
Kullanıcı veri tabanında bulunamadı.
```

```text
Girdiğin kod hatalı veya süresi dolmuş.
```

### `POST /api/User/refresh`

Yeni access token ve refresh token üretir.

Request body:

```json
{
  "accessToken": "old-access-token",
  "refreshToken": "old-refresh-token"
}
```

Success response:

```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

Olası hata:

```text
Refresh token geçersiz veya süresi dolmuş.
```

### `GET /api/User/profile`

Giriş yapan kullanıcının profil özetini döner.

Headers:

```http
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "userName": "oguzhan",
  "createdAt": "2026-05-08T17:42:15.000Z",
  "level": "A1",
  "totalLearnedWords": 12,
  "dailyNewWords": 10,
  "levelBasedLearnedWords": [
    {
      "level": "A1",
      "words": 8
    },
    {
      "level": "A2",
      "words": 4
    }
  ]
}
```

Frontend tarafında şu ekranlar bu endpoint'i kullanabilir:
- Ana Sayfa
- Rapor
- Ayarlar

## 2. Word API

### `POST /api/Word/add`

Kullanıcının kendi kelimesini ekler.

Headers:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "engWordName": "route",
  "turWordName": "rota",
  "picture": null,
  "level": "A1",
  "samples": [
    "This route is shorter."
  ]
}
```

Success response:

```json
{
  "message": "Word added successfully",
  "id": 1
}
```

Not:
- Bu endpoint genel kelime havuzu listesi döndürmüyor
- Sadece kullanıcıya ait yeni kelime ekleme işi yapıyor

### `GET /ekleword`

Test amaçlı gibi duran bir endpoint.

Not:
- Ürün endpoint'i gibi kullanılmamalı
- Frontend entegrasyonunda baz alınmıyor

## 3. Frontend İçin Şu An Kullanılabilen Gerçek Veri Kaynakları

Bugün gerçek backend ile güvenle bağlanabilen ekranlar:

- Login
- Register
- Forgot Password
- Reset Password
- Session Refresh
- Profile tabanlı Home
- Profile tabanlı Report
- Profile tabanlı Settings

Bugün backend eksik olduğu için mock/fallback ile yürüyen ekranlar:

- Kelime listesi ekranı
- Çalışma oturumu ekranı

Sebep:
- Genel kelime liste endpoint'i yok
- Günlük study queue endpoint'i yok
- Cevap gönderme endpoint'i yok
- Ayar güncelleme endpoint'i yok
- Ayrı rapor endpoint'i yok

## 4. Story Bazlı Eksik API İhtiyaçları

## Story 2: Kelime modülü

PDF'e göre kelime havuzunu frontend'de gerçek veriye bağlamak için minimum şu endpoint gerekli:

### `GET /api/Word/list`

Önerilen response:

```json
[
  {
    "id": 1,
    "engWordName": "route",
    "turWordName": "rota",
    "level": "A1",
    "pictureUrl": null,
    "audioUrl": null,
    "samples": [
      "This route is shorter."
    ]
  }
]
```

Alternatif:
- kullanıcıya göre filtrelenmiş
- seviyeye göre filtrelenmiş

Örnek query destekleri:
- `GET /api/Word/list?level=A1`
- `GET /api/Word/list?search=route`

## Story 3: 6 tekrar çalışma oturumu

Frontend study ekranını gerçek hale getirmek için minimum şu API seti gerekli:

### `GET /api/Study/today`

Kullanıcının bugünkü çalışma özetini döner.

Önerilen response:

```json
{
  "level": "A1",
  "newWordCount": 10,
  "reviewWordCount": 6,
  "estimatedTotal": 16
}
```

### `POST /api/Study/start-session`

Bugünkü oturumu başlatır ve soruları döner.

Önerilen response:

```json
{
  "sessionId": 17,
  "items": [
    {
      "wordId": 1,
      "engWordName": "route",
      "turWordName": "rota",
      "level": "A1",
      "pictureUrl": null,
      "audioUrl": null,
      "samples": [
        "This route is shorter."
      ]
    }
  ]
}
```

### `POST /api/Study/submit-answer`

Bir soru için kullanıcının cevabını değerlendirir.

Request body:

```json
{
  "sessionId": 17,
  "wordId": 1,
  "answer": "rota"
}
```

Önerilen response:

```json
{
  "isCorrect": true,
  "correctAnswer": "rota",
  "nextReviewDate": "2026-05-10T10:00:00.000Z",
  "currentStep": "Step2"
}
```

## Story 4: Ayarlar

Frontend ayar ekranının gerçekten düzenlenebilir olması için:

### `GET /api/User/settings`

Önerilen response:

```json
{
  "level": "A1",
  "dailyNewWords": 10
}
```

### `PUT /api/User/settings`

Request body:

```json
{
  "level": "A2",
  "dailyNewWords": 15
}
```

## Story 5: Rapor

Mevcut `profile` response temel özet için yeterli ama detay rapor için ayrı endpoint daha temiz olur.

### `GET /api/Report/summary`

Önerilen response:

```json
{
  "totalLearnedWords": 12,
  "dailyNewWords": 10,
  "level": "A1",
  "levelBasedLearnedWords": [
    {
      "level": "A1",
      "words": 8
    }
  ],
  "correctRate": 78,
  "reviewDueCount": 4
}
```

## 5. Frontend Notları

Frontend tarafında mevcut mimari şu varsayımla kuruldu:

- Auth uçları gerçek backend ile çalışır
- Kelime ve study story'leri, eksik endpoint'ler gelene kadar kontrollü fallback ile gösterilir
- Endpoint'ler geldiğinde sadece `services/*` katmanında refactor yaparak gerçek veriye geçilebilir

Frontend'in şu an backend'e göre kullandığı gerçek route prefix'i:

- `api/User/*`
- `api/Word/*`

Bu önemli çünkü önceki bazı prototiplerde `api/auth/*` varsayımı vardı. Mevcut backend yapısı bu değil.
