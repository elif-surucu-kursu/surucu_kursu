# 🚗 Elif Sürücü Kursu Web Sitesi

Modern, responsive ve admin panelli sürücü kursu web sitesi.

## 🌟 Özellikler

- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Admin paneli ile kolay içerik yönetimi
- ✅ Online kayıt formu
- ✅ Blog sistemi
- ✅ SSS (Sıkça Sorulan Sorular) bölümü
- ✅ Kurs yönetimi
- ✅ Müşteri yorumları
- ✅ Bildirim sistemi

## 📁 Proje Yapısı

```
elif-surucu-kursu/
├── admin/              # Admin paneli
│   ├── index.html
│   ├── admin.js
│   ├── admin.css
│   └── config.yml
├── data/               # JSON veri dosyaları
│   ├── site_settings.json
│   ├── courses.json
│   ├── blog_posts.json
│   ├── faq.json
│   └── ...
├── images/             # Görseller
├── index.html          # Ana sayfa
├── blog.html           # Blog sayfası
├── sss.html            # SSS sayfası
├── iletisim.html       # İletişim sayfası
├── styles.css          # Ana stil dosyası
└── script.js           # Ana JavaScript dosyası
```

## 🚀 Yayınlama

Detaylı yayınlama rehberi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

### Hızlı Başlangıç (Netlify)

1. Bu projeyi GitHub'a yükleyin
2. [Netlify](https://netlify.com) hesabı oluşturun
3. "Add new site" > "Import an existing project"
4. GitHub repository'nizi seçin
5. Build settings:
   - Build command: (boş)
   - Publish directory: `/` (root)
6. "Deploy site" butonuna tıklayın

## 🎨 Admin Paneli

Admin paneline erişim: `/admin/index.html`

Admin paneli ile:
- Site ayarlarını düzenleyebilirsiniz
- Kursları yönetebilirsiniz
- Blog yazıları ekleyebilirsiniz
- SSS sorularını yönetebilirsiniz
- Müşteri yorumları ekleyebilirsiniz
- Bildirimler oluşturabilirsiniz

**Not:** Admin paneli şu anda herkese açıktır. Güvenlik için şifre koruması eklenmesi önerilir.

## 🔧 Geliştirme

### Yerel Geliştirme

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADI/elif-surucu-kursu.git
   cd elif-surucu-kursu
   ```

2. Basit bir HTTP sunucusu başlatın (Python ile):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # veya Node.js ile (http-server kuruluysa)
   npx http-server
   ```

3. Tarayıcıda açın: `http://localhost:8000`

## 📝 Notlar

- Admin paneli değişiklikleri LocalStorage'a kaydeder
- Kalıcı değişiklikler için JSON dosyalarını güncelleyin
- Form gönderimi Web3Forms API kullanır

## 📞 İletişim

Sorularınız için lütfen iletişime geçin.

## 📄 Lisans

Bu proje özel bir projedir.

