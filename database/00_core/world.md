# World

## Table: worlds

Menyimpan dunia utama FFS.

### Fields

| Field | Type | Description |
|---|---|---|
| world_id | UUID | ID unik dunia |
| world_code | STRING | Kode dunia |
| name | STRING | Nama dunia |
| real_start_date | DATETIME | Titik awal waktu dunia nyata |
| ffs_start_date | DATETIME | Titik awal waktu FFS |
| status | STRING | Status dunia |
| created_at | DATETIME | Waktu pembuatan |
| updated_at | DATETIME | Perubahan terakhir |

---

## Example

world_id:
world_001

world_code:
FFS_MAIN

name:
Founder Fantasy Simulator World

real_start_date:
2026-08-29

ffs_start_date:
1996-08-29

status:
active

---

## Rules

1. Satu world dapat memiliki banyak region.
2. Satu world memiliki satu FFS timeline utama.
3. World tidak bergantung pada player.
4. Player masuk ke world yang sudah berjalan.
5. World dapat terus berjalan walaupun tidak ada player aktif.
