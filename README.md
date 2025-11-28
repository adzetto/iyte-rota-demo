# İYTE Yolculuk · Mobil UI Konsepti

Modern, sıcak ve kontrastlı bir kampüs paylaşımlı yolculuk arayüzü. Statik HTML/CSS/JS olarak hazır; GitHub Pages ile yayınlanabilir.

## Geliştirme

- Bağımlılık yok; statik dosyalar: `index.html`, `app.js`.
- Yerelde ön izleme:
  ```bash
  npx serve .
  ```

## Yayınlama (GitHub Pages)

Bu repo otomatik olarak GitHub Pages'a dağıtılır:

1. `main` branch'ine push yapın.
2. GitHub Actions, `.github/workflows/deploy.yml` ile içeriği Pages'a yükler ve `gh-pages` ortamına dağıtır.
3. İlk çalışmanın tamamlanmasının ardından repo ayarlarında (Settings → Pages) URL görüntülenir.
