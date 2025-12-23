# 🚀 Web Sitesi Yayınlama Rehberi

Bu rehber, Elif Sürücü Kursu web sitesini admin paneli ile birlikte yayınlamanız için gerekli adımları içerir.

## 📋 Seçenekler

### 1. Netlify (ÖNERİLEN - En Kolay ve Ücretsiz)

Netlify, static web sitelerini yayınlamak için en popüler ve kullanıcı dostu platformlardan biridir.

#### Adımlar:

1. **Netlify Hesabı Oluşturun**
   - https://netlify.com adresine gidin
   - "Sign up" butonuna tıklayın
   - GitHub, GitLab veya e-posta ile kayıt olun (GitHub önerilir)

2. **GitHub Repository Oluşturun (Önerilir)**
   - https://github.com adresinde yeni bir repository oluşturun
   - Projenizi GitHub'a yükleyin:
     ```bash
     git init
     git add .
     git commit -m "İlk commit"
     git branch -M main
     git remote add origin https://github.com/KULLANICI_ADI/elif-surucu-kursu.git
     git push -u origin main
     ```

3. **Netlify'a Deploy Edin**
   - Netlify dashboard'a gidin
   - "Add new site" > "Import an existing project" seçin
   - GitHub'ı seçin ve repository'nizi seçin
   - Build settings:
     - **Build command:** (boş bırakın - static site)
     - **Publish directory:** `/` (root dizin)
   - "Deploy site" butonuna tıklayın

4. **Site Ayarları**
   - Site adınız otomatik oluşturulur (örn: `elif-surucu-kursu-123abc.netlify.app`)
   - Özel domain eklemek için: Site settings > Domain management > Add custom domain

5. **Admin Paneli Erişimi**
   - Admin paneli: `https://SITE_ADINIZ.netlify.app/admin/index.html`
   - Admin paneli herkese açık olacaktır (güvenlik için şifre koruması eklenebilir)

#### Netlify'nin Avantajları:
- ✅ Ücretsiz (temel özellikler)
- ✅ Otomatik SSL sertifikası
- ✅ Kolay custom domain
- ✅ GitHub ile otomatik deploy
- ✅ Hızlı CDN

#### Alternatif: Git Olmadan Yükleme (Netlify Drop)
Eğer Git kullanmak istemiyorsanız veya kurulu değilse:
1. https://app.netlify.com/drop adresine gidin.
2. `elif-surucu-kursu` klasörünü sürükleyip sayfaya bırakın.
3. Site saniyeler içinde yayına girecektir.
4. Daha sonra güncelleme yapmak için "Deploys" sekmesinden yeni klasör sürükleyebilirsiniz.

---

### 2. Vercel (Alternatif - Çok Hızlı)

Vercel, Next.js için popüler ama static siteler için de mükemmel.

#### Adımlar:

1. **Vercel Hesabı Oluşturun**
   - https://vercel.com adresine gidin
   - GitHub ile giriş yapın

2. **Projeyi Import Edin**
   - Dashboard'da "Add New Project" tıklayın
   - GitHub repository'nizi seçin
   - Framework Preset: "Other"
   - Root Directory: `./`
   - Build Command: (boş bırakın)
   - Output Directory: (boş bırakın)
   - "Deploy" butonuna tıklayın

3. **Site URL'i**
   - Site otomatik olarak yayınlanır: `https://elif-surucu-kursu.vercel.app`
   - Admin paneli: `https://elif-surucu-kursu.vercel.app/admin/index.html`

#### Vercel'in Avantajları:
- ✅ Çok hızlı CDN
- ✅ Otomatik SSL
- ✅ Kolay custom domain
- ✅ GitHub entegrasyonu

---

### 3. GitHub Pages (Ücretsiz ama Sınırlı)

GitHub Pages, GitHub repository'leriniz için ücretsiz hosting sağlar.

#### Adımlar:

1. **GitHub Repository Oluşturun**
   - GitHub'da yeni bir repository oluşturun
   - Projenizi yükleyin

2. **GitHub Pages'i Aktifleştirin**
   - Repository settings > Pages
   - Source: "Deploy from a branch" seçin
   - Branch: `main` ve `/ (root)` seçin
   - Save'e tıklayın

3. **Site URL'i**
   - Site yayınlanır: `https://KULLANICI_ADI.github.io/elif-surucu-kursu`
   - Admin paneli: `https://KULLANICI_ADI.github.io/elif-surucu-kursu/admin/index.html`

#### GitHub Pages'in Dezavantajları:
- ⚠️ Admin paneli herkese açık
- ⚠️ Özel domain için DNS ayarları gerekir
- ⚠️ Build süreleri daha uzun olabilir

---

## 🔒 Admin Paneli Güvenliği (ÖNEMLİ)

Admin paneli şu anda herkese açık. Güvenlik için:

### Netlify Identity ile Şifre Koruması (Netlify kullanıyorsanız)

1. Netlify Dashboard > Site settings > Identity
2. "Enable Identity" tıklayın
3. Services > Git Gateway'i aktifleştirin
4. Admin klasörü için şifre koruması ekleyin

Veya `.htaccess` benzeri bir yapı için Netlify'ın **Netlify Functions** kullanılabilir.

### Basit Şifre Koruması (Tüm Platformlar)

Admin paneli için basit bir şifre kontrolü eklenebilir. İsterseniz bunu ekleyebilirim.

---

## 🌐 Custom Domain Ekleme

### Netlify için:
1. Site settings > Domain management > Add custom domain
2. Domain'inizi girin (örn: `elifsurucu.com`)
3. DNS ayarlarını domain sağlayıcınızdan yapın:
   - A record: `@` -> `75.2.60.5`
   - CNAME: `www` -> `SITE_ADINIZ.netlify.app`
4. SSL otomatik olarak aktifleşir

### Vercel için:
1. Project settings > Domains
2. Domain'inizi ekleyin
3. DNS kayıtlarını ekleyin (yönergeler otomatik gösterilir)

---

## 📝 Önemli Notlar

1. **JSON Dosyaları**: Admin paneli değişiklikleri LocalStorage'a kaydediyor. Kalıcı olması için JSON dosyalarını manuel olarak güncellemeniz gerekebilir.

2. **Görsel Yükleme**: Admin panelinden yüklenen görseller `images/uploads/` klasörüne kaydedilir. Bu klasörü Git'e eklemeyi unutmayın.

3. **Form Gönderimi**: Kayıt formu Web3Forms API kullanıyor. API key'inizin doğru olduğundan emin olun.

4. **Test**: Yayınlamadan önce tüm sayfaları ve admin panelini test edin.

---

## 🚨 Sorun Giderme

### Admin paneli çalışmıyor:
- Tarayıcı konsolunu kontrol edin (F12)
- JSON dosyalarının doğru yüklendiğinden emin olun
- CORS hataları olabilir (static hosting'de genelde sorun olmaz)

### Görseller görünmüyor:
- Görsellerin `images/` klasöründe olduğundan emin olun
- Path'lerin doğru olduğunu kontrol edin (relative path'ler önerilir)

### Form çalışmıyor:
- Web3Forms API key'inizi kontrol edin
- Network sekmesinde hata mesajlarını kontrol edin

---

## 📞 Destek

Herhangi bir sorunuz varsa veya ek bir özellik eklemek isterseniz yardımcı olabilirim!

