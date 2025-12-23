# GitHub'a Yükleme Talimatları

Git kurulumunuzu tamamladım ve proje dosyalarınızı hazırladım. Şimdi dosyaları GitHub'a göndermek için aşağıdaki adımları takip etmelisiniz.

## 1. GitHub'da Depo (Repository) Oluşturun
1. [github.com/new](https://github.com/new) adresine gidin.
2. **Repository name** kısmına `elif-surucu-kursu` yazın.
3. **Public** seçeneğinin işaretli olduğundan emin olun.
4. Diğer kutucukları (README, .gitignore vb.) **işaretlemeyin** (çünkü biz bunları oluşturduk).
5. **Create repository** butonuna tıklayın.

## 2. Kodları Gönderin
GitHub'da depo oluşturduktan sonra size verilen sayfanın **"…or push an existing repository from the command line"** bölümündeki kodları kullanacağız.

Aşağıdaki komutları sırasıyla terminale yapıştırın:

> **NOT:** Eğer terminalde `git` komutu çalışmazsa, lütfen VS Code penceresini kapatıp yeniden açın. Git yeni yüklendiği için terminalin yenilenmesi gerekebilir.

```bash
git remote add origin https://github.com/KULLANICI_ADINIZ/elif-surucu-kursu.git
git push -u origin main
```

*Not: `KULLANICI_ADINIZ` yazan yeri kendi GitHub kullanıcı adınızla değiştirmeyi unutmayın!*

## 3. Netlify'da Yayınlayın
1. [app.netlify.com](https://app.netlify.com) adresine gidin.
2. **Add new site** > **Import an existing project** seçeneğine tıklayın.
3. **GitHub**'ı seçin.
4. `elif-surucu-kursu` deponuzu seçin.
5. Hiçbir ayarı değiştirmeden **Deploy site** butonuna tıklayın.

Web siteniz ve Admin paneli yayına girecektir! 🎉
