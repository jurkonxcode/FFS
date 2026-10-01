# FFS Time System

FFS memiliki dua konsep waktu:

1. Real World Time
2. FFS World Time

---

## Table: world_time

| Field | Type | Description |
|---|---|---|
| time_id | UUID | ID waktu |
| world_id | UUID | Dunia |
| real_timestamp | DATETIME | Waktu dunia nyata |
| ffs_timestamp | DATETIME | Waktu dunia FFS |
| time_multiplier | NUMBER | Kecepatan waktu |
| created_at | DATETIME | Waktu pembuatan |

---

## Initial Anchor

Real World:

29 August 2026

FFS World:

29 August 1996

---

## Important

Time calculation tidak disimpan hanya sebagai angka tanggal.

Engine Time bertanggung jawab menghitung:

real time
↓
FFS time
↓
world events

Database menyimpan state dan checkpoint waktu.

---

## Future

Time System nantinya dapat mendukung:

- accelerated time
- convergence
- 1:1 time
- future timeline
- alternate timeline
- historical branching

Perhitungan final time multiplier ditentukan oleh Time Engine, bukan database.
