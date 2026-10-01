# Real World Database

Database ini menyimpan keadaan dunia nyata yang menjadi referensi dasar bagi Founder Fantasy Simulator (FFS).

Rentang waktu utama:

1996 → 2026

Database ini digunakan oleh World Engine untuk membangun kondisi awal dan perkembangan dunia FFS.

---

# Fungsi

Real World Database menyediakan baseline:

- negara
- wilayah
- populasi
- ekonomi
- teknologi
- perusahaan
- industri
- budaya
- masyarakat
- peristiwa sejarah
- perkembangan dunia
- kondisi dunia pada periode tertentu

---

# Prinsip Utama

Real World Database ≠ FFS World Database.

Real World Database adalah referensi sejarah dunia nyata.

FFS World adalah hasil simulasi.

---

# Hubungan

Real World
    ↓
Real World Database
    ↓
World Engine
    ↓
FFS World State
    ↓
Player Actions
    ↓
FFS History
    ↓
Alternate History

---

# Timeline

Database mencakup:

1996
1997
1998
...
2026

Setiap tahun dapat memiliki World State Snapshot.

---

# World State Snapshot

Snapshot menggambarkan kondisi dunia pada periode tertentu.

Contoh:

1996

- teknologi
- ekonomi
- perusahaan
- populasi
- industri
- transportasi
- komunikasi
- internet
- kondisi sosial
- peristiwa penting

---

# Historical Events

Event menyimpan kejadian yang terjadi pada waktu tertentu.

Contoh:

- perusahaan berdiri
- teknologi diperkenalkan
- perang
- krisis ekonomi
- bencana
- penemuan
- perubahan teknologi
- perubahan industri
- peristiwa sosial

---

# Source

Setiap data historis penting harus memiliki sumber.

Data tidak boleh dibuat berdasarkan tebakan jika data faktual tersedia.

---

# FFS Divergence

World Engine menggunakan Real World Database sebagai baseline.

Jika player atau simulasi FFS mengubah keadaan dunia:

Real World State
        ↓
FFS State
        ↓
Divergence
        ↓
Alternate FFS History

Setelah divergence terjadi, FFS tidak otomatis kembali ke sejarah dunia nyata.

---

# Contoh

Real World:

Perusahaan X berkembang pada tahun 2000.

FFS:

Player membeli perusahaan tersebut pada tahun 1998.

Maka:

Real World:
Perusahaan X → perkembangan normal

FFS:
Perusahaan X → dimiliki player
              ↓
         perkembangan berbeda

Kedua timeline tetap memiliki referensi sejarah dunia nyata.

---

# Status

Real World Database v0.1

Database ini masih berupa blueprint.

Data faktual akan dimasukkan secara bertahap.

World Engine harus dapat berjalan walaupun sebagian data historis belum tersedia.
