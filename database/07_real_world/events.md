# Real World Historical Events

Menyimpan peristiwa nyata.

---

## Table: real_world_events

| Field | Type | Description |
|---|---|---|
| event_id | UUID | ID |
| date | DATETIME | Tanggal |
| end_date | DATETIME | Akhir |
| title | STRING | Judul |
| category | STRING | Kategori |
| description | TEXT | Deskripsi |
| country_ids | JSON | Negara terkait |
| region_ids | JSON | Wilayah |
| importance | INTEGER | Tingkat kepentingan |
| source_id | UUID | Sumber |
| created_at | DATETIME | Dibuat |

---

## Categories

technology
science
economy
business
social
natural_disaster
conflict
politics
culture
transportation
communication
space
medicine

---

## Important

Historical event bersifat append-only.

Event yang telah terjadi tidak dihapus.

---

# Relationship

Real Event
    ↓
World Engine
    ↓
FFS Event

Jika player tidak mengubah event:

Real Event ≈ FFS Event

Jika player mengubah kondisi:

Real Event
    ↓
Divergence
    ↓
FFS Event
