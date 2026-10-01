# Companies

## Table: companies

| Field | Type | Description |
|---|---|---|
| company_id | UUID | ID perusahaan |
| world_id | UUID | Dunia |
| owner_type | STRING | Tipe pemilik |
| owner_id | UUID | Pemilik |
| name | STRING | Nama |
| founded_at | DATETIME | Tahun berdiri |
| closed_at | DATETIME | Tahun tutup |
| status | STRING | Status |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |

---

## Status

active
bankrupt
acquired
closed
inactive

---

## Important

Perusahaan tidak dihapus ketika bangkrut.

Perusahaan menjadi bagian dari sejarah ekonomi dunia.
