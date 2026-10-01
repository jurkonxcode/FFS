# Real World Countries

Menyimpan negara yang ada dalam dunia nyata.

---

## Table: real_world_countries

| Field | Type | Description |
|---|---|---|
| country_id | UUID | ID negara |
| name | STRING | Nama |
| iso_code | STRING | Kode |
| region | STRING | Wilayah |
| founded_date | DATETIME | Tanggal berdiri jika relevan |
| status | STRING | Status |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |

---

## Historical State

Kondisi negara tidak disimpan hanya pada tabel negara.

Perubahan historis disimpan dalam:

real_world_states

dan

real_world_events.

---

## Important

Country identity berbeda dari historical country state.

Satu negara dapat memiliki banyak perubahan keadaan sepanjang timeline.
