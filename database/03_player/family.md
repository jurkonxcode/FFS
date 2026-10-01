# Family

Family menyimpan garis keturunan player.

---

## Table: families

| Field | Type | Description |
|---|---|---|
| family_id | UUID | ID keluarga |
| world_id | UUID | Dunia |
| family_name | STRING | Nama keluarga |
| founder_character_id | UUID | Pendiri |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |

---

## Table: family_members

| Field | Type | Description |
|---|---|---|
| family_member_id | UUID | ID |
| family_id | UUID | Keluarga |
| character_id | UUID | Character |
| parent_character_id | UUID | Orang tua |
| relationship_type | STRING | Hubungan |
| generation | INTEGER | Generasi |
| joined_at | DATETIME | Bergabung |

---

## Example

Generation 1
John Smith

Generation 2
Michael Smith
Sarah Smith

Generation 3
Daniel Smith

---

## Important

Family history harus tetap tersedia walaupun character sudah meninggal.
