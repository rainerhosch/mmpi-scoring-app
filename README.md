# MMPI Scoring Application

Aplikasi web full-stack untuk melaksanakan dan menghitung skor tes Minnesota Multiphasic Personality Inventory (MMPI). Sistem ini dirancang dengan antarmuka klinis yang modern dan mesin skoring (scoring engine) berbasis Python untuk menghitung T-Score secara otomatis serta melakukan validasi profil MMPI.

## Teknologi yang Digunakan

**Backend:**
- Python 3.x
- FastAPI (REST API Framework)
- SQLAlchemy (ORM)
- PyMySQL (Database Driver)
- Uvicorn (ASGI Server)

**Frontend:**
- React.js (Vite)
- Chart.js & react-chartjs-2 (Visualisasi Profil T-Score)
- Axios (HTTP Client)
- Vanilla CSS (Custom Clinical Theme)

**Database:**
- MySQL

## Struktur Proyek

```
mmpi-scoring-app/
├── backend/                # Layanan REST API & Mesin Skoring
│   ├── database.py         # Konfigurasi koneksi database MySQL & .env
│   ├── main.py             # Entry point aplikasi FastAPI
│   ├── models.py           # Definisi skema tabel database (SQLAlchemy)
│   ├── schemas.py          # Definisi skema validasi Pydantic
│   ├── scoring_engine.py   # Algoritma perhitungan Raw Score & T-Score
│   ├── seed.py             # Skrip untuk inisiasi skala dan soal dasar
│   ├── update_questions.py # Skrip parser HTML untuk ekstraksi soal
│   └── routers/            # Kumpulan endpoints API (users, sessions, questions)
├── frontend/               # Aplikasi Antarmuka Pengguna
│   ├── src/
│   │   ├── api.js          # Integrasi Axios ke backend
│   │   ├── App.jsx         # Konfigurasi React Router
│   │   ├── components/     # Komponen UI (QuestionCard, ResultChart)
│   │   ├── pages/          # Halaman utama (StartPage, TestPage, ResultPage)
│   │   └── index.css       # Sistem desain kustom
└── docs/                   # Dokumen referensi & sumber soal tes
```

## Persyaratan Sistem

Pastikan sistem Anda telah terinstal:
- Python 3.10 atau lebih baru
- Node.js versi 18 atau lebih baru
- MySQL Server (misalnya melalui XAMPP atau instalasi mandiri)

## Instalasi dan Konfigurasi

### 1. Konfigurasi Database (MySQL)

1. Pastikan layanan MySQL Anda berjalan.
2. Buat database baru bernama `mmpi_db` atau biarkan skrip backend membuatnya secara otomatis (dengan catatan *user* MySQL Anda memiliki hak akses untuk membuat database).
3. Salin/buat file `.env` di dalam folder `backend/` dan sesuaikan kredensial Anda:

```env
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=mmpi_db
```

### 2. Konfigurasi Backend

Buka terminal dan arahkan ke direktori root proyek, kemudian jalankan perintah berikut:

```bash
cd backend
python -m venv venv

# Aktivasi virtual environment (Windows)
.\venv\Scripts\activate

# Instalasi dependensi
pip install -r requirements.txt

# Menjalankan skrip inisiasi database (membuat tabel dan seeding data awal)
python seed.py

# (Opsional) Jika Anda perlu memperbarui soal ke data asli dari dokumen HTML:
python update_questions.py

# Menjalankan server backend
uvicorn main:app --reload
```
Server backend akan berjalan di `http://localhost:8000`.

### 3. Konfigurasi Frontend

Buka sesi terminal baru, arahkan ke direktori root proyek:

```bash
cd frontend

# Instalasi dependensi NPM
npm install

# Menjalankan development server
npm run dev
```
Aplikasi klien dapat diakses melalui browser pada `http://localhost:5173`.

## Penggunaan Aplikasi

1. **Memulai Sesi**: Pada halaman beranda, masukkan nama, usia, dan jenis kelamin pasien/pengguna untuk memulai sesi tes.
2. **Pengerjaan Soal**: Pengguna akan disajikan antarmuka pertanyaan satu demi satu dengan opsi "Ya" dan "Tidak".
3. **Analisis Hasil**: Setelah tes selesai, sistem akan mengarahkan pengguna ke halaman hasil. Mesin skoring akan mengevaluasi validitas profil (berdasarkan skala L, F, K) dan merender grafik garis profil MMPI beserta garis batas klinis kritis pada T=65.

## Catatan Pengembangan Selanjutnya

Arsitektur sistem ini dibangun untuk siap diintegrasikan dengan fitur lanjutan di masa depan, seperti:
- Penghitungan statistik norma MMPI yang lebih presisi berdasarkan usia dan demografi.
- Modul *Machine Learning* via ekosistem data Python (Scikit-Learn/Pandas) untuk mendeteksi anomali pada profil responden.
- Fitur administrasi untuk penambahan dataset skala klinis secara dinamis.
