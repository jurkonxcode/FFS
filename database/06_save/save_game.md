# Save Game

Save Game menyimpan state permainan.

---

## Table: save_games

| Field | Type | Description |
|---|---|---|
| save_id | UUID | ID save |
| player_id | UUID | Player |
| world_id | UUID | Dunia |
| save_name | STRING | Nama save |
| ffs_timestamp | DATETIME | Waktu FFS |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |
| status | STRING | Status |

---

## Status

active
archived
corrupted

---

## Important

Save Game tidak menggantikan History.

Save = kondisi dunia pada suatu titik.

History = perjalanan dunia menuju kondisi tersebut.
