
# 🚗 BulaksumurRide

**BulaksumurRide** adalah aplikasi ride-sharing berbasis komunitas kampus. Proyek ini dibangun menggunakan stack modern yang scalable dan siap dikembangkan secara kolaboratif:

- **Frontend:** Next.js (JavaScript)
- **Backend:** Express.js (Node.js)
- **Database:** MongoDB Atlas
- **Struktur Monorepo:** `client/` dan `server/`

---

## 📁 Struktur Proyek

```
bulaksumurRide-repo/
├── client/  ← Frontend (Next.js)
├── server/  ← Backend (Express.js + MongoDB)
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/bulaksumurRide-repo.git
cd bulaksumurRide-repo
```

### 2. Jalankan Frontend (Next.js)
```bash
cd client
npm install
npm run dev
```
Akses di: [http://localhost:3000](http://localhost:3000)

---

### 3. Jalankan Backend (Express.js + MongoDB)
```bash
cd ../server
npm install
```

Buat file `.env` di folder `server/` dengan isi:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bulaksumurride?retryWrites=true&w=majority
```

Ganti `<username>`, `<password>`, dan `<cluster>` sesuai data MongoDB Atlas kamu.

Kemudian jalankan:
```bash
npm run dev
```
API berjalan di: [http://localhost:5000/api/rides](http://localhost:5000/api/rides)

---

## 🧪 Testing

- Frontend akan otomatis fetch data dari backend melalui endpoint `GET /api/rides`
- Lihat file `client/pages/index.js` untuk menyesuaikan tampilannya

---

## ⚠️ Catatan Penting

- Jangan upload `.env` ke GitHub (sudah di `.gitignore`)
- Jangan commit `node_modules`
- Jalankan `npm install` setelah pull jika ada dependency baru
- Gunakan branch masing-masing untuk fitur baru
- Selalu lakukan **pull request** sebelum merge ke `main`

---

## 🧭 Roadmap Fitur Selanjutnya

- [ ] Login & Authentication
- [ ] GeoJSON-based Ride Tracking
