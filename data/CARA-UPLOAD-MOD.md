# SCH SAMP — Cara Upload Free Mod Harian
==========================================

## Struktur folder

```
sch-samp/
├── index.html
├── css/style.css
├── js/main.js
├── data/
│   └── free-mods.json   ← EDIT FILE INI untuk upload mod baru
└── mods/
    └── nama_mod.lua     ← TARUH FILE LUA DI SINI
```

---

## Cara upload mod baru (setiap hari)

### Langkah 1 — Taruh file .lua di folder `mods/`
Contoh: `mods/drift_system_v4.lua`

### Langkah 2 — Edit file `data/free-mods.json`
Tambahkan entry baru di **awal array** (index 0 = mod terbaru):

```json
[
  {
    "id": 6,
    "name": "Nama Mod Kamu",
    "desc": "Deskripsi singkat mod ini, apa fungsinya.",
    "category": "Script",
    "file": "mods/nama_file.lua",
    "size": "14 KB",
    "date": "2024-02-01"
  },
  {
    "id": 5,
    "name": "Mod Sebelumnya",
    ...
  }
]
```

### Kategori yang tersedia:
- `HUD`
- `Script`
- `Bot`
- `Launcher`
- `Custom`

---

## Cara kerja sistem

- Mod hari ini dipilih **otomatis** berdasarkan tanggal (berganti tiap tengah malam)
- Semakin banyak entry di JSON, semakin banyak variasi yang tampil
- Mod yang tidak tampil hari ini masuk ke **Arsip**
- Countdown timer menunjukkan kapan mod berikutnya muncul

---

## Tips
- Nama file .lua: gunakan huruf kecil dan underscore, contoh: `hud_neon_v2.lua`
- Ukuran file idealnya di bawah 500KB agar cepat didownload
- Isi field `date` dengan tanggal kamu upload (format: YYYY-MM-DD)
