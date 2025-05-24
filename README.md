# 🚗 BulaksumurRide

**BulaksumurRide** adalah aplikasi ride-sharing berbasis komunitas kampus. Proyek ini dibangun menggunakan stack modern yang scalable dan siap dikembangkan secara kolaboratif.

- 🖥️ Frontend: **Next.js** (JavaScript)
- ⚙️ Backend: **Express.js** (Node.js)
- 🗄️ Database: **MongoDB Atlas**
- 📦 Monorepo structure: `client/` dan `server/`

---

## 📁 Struktur Proyek

bulaksumurRide-repo/
├── client/ ← Frontend (Next.js)
├── server/ ← Backend (Express.js + MongoDB)


---

## 🚀 Cara Menjalankan Project

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/bulaksumurRide-repo.git
cd bulaksumurRide-repo
2. Jalankan Frontend (Next.js)
cd client
npm install
npm run dev
🔗 Akses di: http://localhost:3000

3. Jalankan Backend (Express.js + MongoDB)
cd ../server
npm install
🔐 Buat file .env di folder server/ dengan isi:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bulaksumurride?retryWrites=true&w=majority
Ganti <username>, <password>, dan <cluster> sesuai koneksi MongoDB Atlas milikmu.
Lalu jalankan:

npm run dev
🔗 API berjalan di: http://localhost:5000/api/rides

🧪 Testing

Frontend otomatis fetch data dari backend via GET /api/rides
Cek halaman client/pages/index.js untuk lihat hasilnya
🛠️ Catatan Penting

❌ Jangan upload .env ke GitHub (sudah di .gitignore)
❌ Jangan commit node_modules
✅ Jalankan npm install setelah pull jika ada perubahan dependency
✅ Gunakan branch masing-masing untuk fitur baru
✅ Lakukan Pull Request sebelum merge ke main
✨ Fitur Selanjutnya

🔐 Login & Authentication
🗺️ GeoJSON + Ride Tracking
