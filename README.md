# ZAMANALTI

ZAMANALTI, gerçek mekânları zaman katmanları üzerinden keşfetmeye odaklanan mobil deneyimdir.

## Tasarım yönü

Seçilen arayüz, Concept 4 yaklaşımını temel alır:

- siyah / gece mavisi ana zemin
- elektrik mavi ve turuncu atmosfer ışıkları
- neon lime vurgu rengi
- dairesel “zaman radarı”
- klasik alt tab bar yok
- navigasyon ve eylemler ekran içindeki deneyim kartlarına gömülü
- güçlü tipografi, yüksek kontrast ve sinematik keşif hissi

## Ürün çekirdeği

İlk sürümde hedeflenen ana deneyimler:

1. **Zaman Haritası** — gerçek mekânları klasik harita pinleri yerine zaman ağı/radar biçiminde keşfetmek.
2. **Gizli Katman** — aynı mekânın farklı tarihsel dönemlerini üst üste açmak.
3. **Yakındaki İzler** — kullanıcının çevresindeki görünmeyen hikâyeleri bulmak.
4. **Hafıza Rotası** — bir şehri olaylar, insanlar ve anılar üzerinden gezmek.
5. **Derin Mod** — uzun anlatımlar ve sesli gezi deneyimleri.
6. **Zaman Defteri** — ziyaret edilen yerleri ve kişisel keşifleri saklamak.
7. **Geleceğe Bırak** — bir mekâna gelecekte açılacak not, ses veya anı bırakmak.

## İlk kodlanan ekran

Şu anda ana ekranın çalışan görsel iskeleti hazırdır:

- açılış/splash deneyimi
- ZAMANALTI marka dili
- İstanbul zaman radarı
- seçilebilir örnek mekânlar
- seçilebilir zaman katmanları
- ekran içine gömülü deneyim kartları
- seçilen deneyimin detay paneli
- “Geleceğe Bırak” alanı

İçerik şu aşamada örnek/veri modeli seviyesindedir; tarihsel metinler ve medya içerikleri yayın öncesi kaynaklandırılacaktır.

## Çalıştırma

Node.js 22.13+ önerilir.

```bash
npm install
npx expo install --fix
npm run typecheck
npm start
```

Android yerel geliştirme:

```bash
npm run android
```

APK önizleme:

```bash
npx eas-cli build -p android --profile preview
```


## 22 Eylül 2026 kullanılabilir MVP durumu

- Android/iOS safe-area desteği eklendi; sistem durum ve gezinme alanlarının içerik üstüne binmesi engellendi.
- Arama alanı çalışır durumda.
- Konum izni kullanıcı isteğiyle alınır; mekânlara gerçek kuş uçuşu mesafe hesaplanır.
- Galata Kulesi, Ayasofya, Yerebatan Sarnıcı ve Balat için kaynaklı tarih katmanları, özetler ve anlatı bölümleri eklendi.
- Mekân detayında kaynak bağlantıları açılabilir.
- Derin Mod, cihazın Türkçe metin-okuma motoruyla gerçek anlatım oynatır.
- Hafıza Rotası, her durağı cihazın harita uygulamasında yol tarifine açar.
- Zaman Kapsülü, kullanıcı mesajını seçilen tarihle cihazda kalıcı olarak saklar ve tarih gelmeden içeriği kapalı tutar.
- Alt tab bar kullanılmaz; gezinme deneyim kartlarının ve ekran içi eylemlerin içindedir.

### Yerel güncelleme

```bash
git pull --ff-only origin main
npm install
npx expo install --fix
npx expo start --clear
```

### Üretim öncesi kalan işler

Bu sürüm çalışan bir MVP'dir. Mağaza yayını için insan sesli kayıt/CDN, hesap ve bulut senkronizasyonu, şifreli zaman kapsülleri, daha geniş şehir/mekân kataloğu, içerik yönetimi, çevrimdışı medya, analitik/çökme raporlama ve gerçek cihaz QA çalışmaları ayrıca tamamlanmalıdır.
