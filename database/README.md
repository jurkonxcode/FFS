# FFS Database Architecture

Founder Fantasy Simulator (FFS)

Database architecture untuk menyimpan dunia, waktu, NPC, player, ekonomi, sejarah, keluarga, dan save game.

---

## Prinsip Utama

Database FFS dibagi menjadi beberapa modul.

Setiap modul memiliki tanggung jawab yang jelas.

Tujuannya:

- mudah dikembangkan
- mudah diuji
- mudah diperbaiki
- bug mudah dilokalisasi
- sistem tidak saling bergantung secara berlebihan
- data historis tidak mudah hilang
- memungkinkan perkembangan dunia dalam jangka panjang

---

# Modul Database

## 00 Core

Fondasi utama dunia FFS.

Menyimpan:

- world
- time
- global settings

Modul lain bergantung pada modul ini.

---

## 01 World

Menyimpan struktur dunia fisik.

Contoh:

- region
- kota
- lokasi
- bangunan
- jalan
- fasilitas

---

## 02 NPC

Menyimpan kehidupan NPC.

Contoh:

- identitas NPC
- usia
- pekerjaan
- lokasi
- aktivitas
- jadwal
- hubungan sosial

NPC harus dapat hidup tanpa player.

---

## 03 Player

Menyimpan:

- akun player
- karakter
- keluarga
- keturunan
- legacy

Player berbeda dengan character.

Player mengendalikan perjalanan legacy.

---

## 04 Economy

Menyimpan sistem ekonomi.

Contoh:

- perusahaan
- aset
- inventory
- uang
- transaksi
- produksi
- pasar

---

## 05 History

Menyimpan sejarah dunia.

Contoh:

- peristiwa sejarah
- perubahan dunia
- perusahaan historis
- tokoh historis
- event yang dibuat player
- alternate history

History bersifat persistent.

Data sejarah tidak boleh dihapus hanya karena entity sudah tidak aktif.

---

## 06 Save

Menyimpan keadaan permainan.

Contoh:

- save game
- snapshot
- world state
- player state

---

# Prinsip ID

Setiap entity utama harus memiliki ID unik.

Contoh:

world_id
region_id
location_id
building_id
npc_id
player_id
character_id
family_id
company_id
asset_id
transaction_id
event_id
save_id

ID tidak boleh bergantung pada nama.

Contoh yang SALAH:

npc_id = "john"

Contoh yang BENAR:

npc_id = "npc_8f31..."

Nama NPC dapat berubah.

ID tetap.

---

# Prinsip Timestamp

Entity yang membutuhkan riwayat menggunakan:

created_at
updated_at

Event sejarah menggunakan:

occurred_at

FFS menggunakan waktu dunia FFS sebagai referensi utama untuk kejadian di dalam game.

---

# Prinsip Soft Delete

Data penting tidak langsung dihapus.

Gunakan status seperti:

active
inactive
deceased
destroyed
archived

Contoh:

NPC yang meninggal tetap disimpan.

Perusahaan yang bangkrut tetap disimpan.

Bangunan yang dihancurkan tetap dapat memiliki catatan sejarah.

---

# Prinsip Historical Data

FFS bukan hanya menyimpan kondisi sekarang.

FFS juga menyimpan bagaimana kondisi tersebut terjadi.

Contoh:

Balance saat ini:

100000

Tetapi database juga harus dapat menjelaskan:

+50000 hasil penjualan
-20000 pembelian bahan
-10000 biaya operasional
+80000 investasi

Dengan demikian:

Current State ≠ History

Keduanya harus dapat dipisahkan.

---

# Prinsip Modular

Setiap modul database harus dapat dikembangkan secara independen.

Contoh:

Bug pada NPC Schedule:

database/02_npc/npc_schedule.md

tidak seharusnya memerlukan perubahan:

database/04_economy/

---

# Prinsip Relasi

Relasi antar modul harus dibuat sesederhana mungkin.

Contoh:

NPC dapat memiliki:

npc_id
location_id
company_id

Tetapi NPC tidak menyimpan seluruh data perusahaan di dalam tabel NPC.

NPC hanya menyimpan referensi.

---

# Prinsip Future Compatibility

Database harus mampu mendukung:

- real history
- alternate history
- fantasy
- time travel
- multiple generations
- companies
- economy
- player-created history
- future technology

tanpa harus mengganti struktur dasar dunia.

---

# Status

Database Blueprint v0.1

Belum terhubung ke database server.

Belum menggunakan Supabase.

Blueprint ini menjadi dasar sebelum SQL implementation dibuat.
