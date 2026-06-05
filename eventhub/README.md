# EventHub — Platform Informasi & Manajemen Event Kampus

Aplikasi web fullstack untuk menampilkan dan mengelola event kampus.

## Teknologi

| Layer     | Stack                                          |
|-----------|------------------------------------------------|
| Backend   | Django 5.x + Django REST Framework             |
| Frontend  | Next.js 14 (App Router) + TypeScript           |
| Database  | SQLite                                         |
| Styling   | Tailwind CSS                                   |
| Icons     | Lucide React                                   |

---

## Cara Menjalankan

### Backend (Django)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Jalankan migrasi database
python manage.py migrate

# Buat admin & sample kategori
python create_admin.py

# Jalankan server
python manage.py runserver
```

Backend berjalan di: `http://localhost:8000`

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Jalankan server development
npm run dev
```

Frontend berjalan di: `http://localhost:3000`

---

## Akun Admin Default

| Field    | Value                  |
|----------|------------------------|
| Email    | admin@eventhub.com     |
| Password | admin123               |

---

## Struktur URL

### Public
| URL                  | Deskripsi                       |
|----------------------|---------------------------------|
| `/`                  | Landing page                    |
| `/events`            | Daftar semua event + filter     |
| `/events/[id]`       | Detail event                    |

### Admin (wajib login)
| URL                         | Deskripsi               |
|-----------------------------|-------------------------|
| `/admin/login`              | Halaman login admin     |
| `/admin/dashboard`          | Dashboard statistik     |
| `/admin/events`             | Kelola semua event      |
| `/admin/events/create`      | Buat event baru         |
| `/admin/events/[id]/edit`   | Edit event              |
| `/admin/categories`         | Kelola kategori         |

---

## API Endpoints

### Auth
```
POST   /api/auth/login/      — Login, mengembalikan token
POST   /api/auth/logout/     — Logout (butuh token)
```

### Public
```
GET    /api/events/           — Daftar event (filter: category, status, search)
GET    /api/events/featured/  — Event unggulan
GET    /api/events/<id>/      — Detail event
GET    /api/categories/       — Daftar kategori
```

### Admin (Token required)
```
GET    /api/admin/stats/                  — Statistik dashboard
GET    /api/admin/events/                 — Daftar semua event
POST   /api/admin/events/                 — Buat event baru
GET    /api/admin/events/<id>/            — Detail event
PUT    /api/admin/events/<id>/            — Update event
DELETE /api/admin/events/<id>/            — Hapus event
GET    /api/admin/categories/             — Daftar kategori
POST   /api/admin/categories/             — Buat kategori
PUT    /api/admin/categories/<id>/        — Update kategori
DELETE /api/admin/categories/<id>/        — Hapus kategori
```

---

## Struktur Proyek

```
eventhub/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── create_admin.py
│   ├── eventhub/
│   │   ├── settings.py
│   │   └── urls.py
│   └── events/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
└── frontend/
    ├── package.json
    ├── tailwind.config.ts
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx               (landing)
    │   ├── events/
    │   │   ├── page.tsx           (daftar event)
    │   │   └── [id]/page.tsx      (detail event)
    │   └── admin/
    │       ├── layout.tsx
    │       ├── login/page.tsx
    │       ├── dashboard/page.tsx
    │       ├── events/page.tsx
    │       ├── events/create/page.tsx
    │       ├── events/[id]/edit/page.tsx
    │       └── categories/page.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Sidebar.tsx
    │   ├── EventCard.tsx
    │   ├── StatCard.tsx
    │   ├── Badge.tsx
    │   ├── AdminGuard.tsx
    │   └── ToasterProvider.tsx
    └── lib/
        ├── api.ts
        ├── auth.ts
        └── utils.ts
```
