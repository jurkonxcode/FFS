# Character

Character adalah individu yang dikendalikan player.

---

## Table: characters

| Field | Type | Description |
|---|---|---|
| character_id | UUID | ID character |
| player_id | UUID | Player |
| world_id | UUID | Dunia |
| first_name | STRING | Nama depan |
| last_name | STRING | Nama keluarga |
| gender | STRING | Gender |
| birth_date | DATETIME | Lahir |
| death_date | DATETIME | Meninggal |
| nationality | STRING | Negara |
| home_location_id | UUID | Rumah |
| status | STRING | Status |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |

---

## Status

active
deceased
missing
retired

---

## Important

Character yang meninggal TIDAK dihapus.

Character menjadi bagian dari sejarah keluarga.
