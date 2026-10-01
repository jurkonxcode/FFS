# NPC

NPC adalah penduduk dunia FFS.

NPC dapat hidup tanpa player.

---

## Table: npcs

| Field | Type | Description |
|---|---|---|
| npc_id | UUID | ID NPC |
| world_id | UUID | Dunia |
| first_name | STRING | Nama depan |
| last_name | STRING | Nama belakang |
| gender | STRING | Gender |
| birth_date | DATETIME | Tanggal lahir |
| death_date | DATETIME | Tanggal meninggal |
| nationality | STRING | Negara |
| home_location_id | UUID | Rumah |
| current_location_id | UUID | Lokasi sekarang |
| occupation | STRING | Pekerjaan |
| status | STRING | Status |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |

---

## Status

active
deceased
missing
inactive

---

## Important

NPC ID tidak berubah selama hidup NPC.

NPC yang meninggal tetap berada di database.
