## 🚗 BulaksumurRide

**BulaksumurRide** adalah aplikasi ride-sharing berbasis komunitas kampus. Proyek ini dibangun menggunakan stack modern yang scalable dan siap dikembangkan secara kolaboratif.

- 🧠 Frontend: **Next.js** (JavaScript)
- 🔧 Backend: **Express.js** (Node.js)
- 🗄️ Database: **MongoDB Atlas**
- 📁 Struktur Monorepo: `client/` (frontend), `server/` (backend)

---

## 📁 Struktur Proyek
bulaksumurRide-repo/
├── client/                     # Frontend (Next.js)
│   └── README.md
└── server/                     # Backend (Express.js + MongoDB)
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── index.js                # Setup Express & MongoDB
    ├── api/
    │   ├── rideRoutes.js       # (Kosong / Placeholder)
    │   └── driverRoutes.js     # (Kosong / Placeholder)
    ├── controllers/
    │   ├── rideController.js   # (Kosong / Placeholder)
    │   └── driverController.js # (Kosong / Placeholder)
    ├── services/
    │   ├── rideBookingService.js     # (Kosong / Placeholder)
    │   ├── fareEstimationService.js  # (Kosong / Placeholder)
    │   ├── driverLocationService.js  # (Kosong / Placeholder)
    │   └── driverMatchingService.js  # (Kosong / Placeholder)
    └── models/                 # <-- FOKUS UTAMA KITA
        ├── User.js             # ✅ Sudah sesuai
        ├── Ride.js             # ✅ Menggunakan GeoJSON Point
        └── DriverStatus.js     # ✅ GeoJSON Point + 2dsphere index


---

## 🚀 Cara Menjalankan Project

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

### 3. Jalankan Backend (Express.js + MongoDB)
```bash
cd ../server
npm install
```
Buat file `.env` di folder `server/` dengan isi:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bulaksumurride?retryWrites=true&w=majority
```
Ganti `<username>`, `<password>`, dan `<cluster>` sesuai koneksi MongoDB Atlas milikmu.

```bash
npm run dev
```
API berjalan di: [http://localhost:5000/api/rides](http://localhost:5000/api/rides)

---

## 🗺️ Instalasi Map (Leaflet)

Untuk fitur **peta dan rute**, proyek ini menggunakan:
- [Leaflet](https://leafletjs.com/)
- [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/)

### 📦 Install Dependency
```bash
npm install leaflet leaflet-routing-machine
```

### 📁 Contoh Import di Komponen (Next.js)
```js
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

useEffect(() => {
  const map = L.map(mapRef.current).setView([-7.77, 110.37], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  L.Routing.control({ waypoints: [...] }).addTo(map);
}, []);
```

### ⚠️ Catatan:
- Jalankan **Leaflet hanya di client-side** (`useEffect`), karena tidak compatible dengan SSR.
- Beberapa ikon bawaan mungkin tidak muncul — gunakan ikon kustom jika perlu.

---

## 🧪 Testing
Frontend otomatis fetch data dari backend via `GET /api/rides`.
Cek halaman `client/pages/index.js` untuk melihat hasilnya.

---

## 📌 Catatan Penting

❌ Jangan upload `.env` ke GitHub (sudah di `.gitignore`)
❌ Jangan commit `node_modules`
✅ Jalankan `npm install` setelah `git pull` jika ada perubahan dependency
✅ Gunakan **branch** masing-masing untuk fitur baru
✅ Lakukan **Pull Request** sebelum merge ke `main`

---

## ⏭️ Fitur Selanjutnya

- Login & Authentication
- GeoJSON + Ride Tracking
