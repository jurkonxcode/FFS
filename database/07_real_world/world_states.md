# Real World State Snapshots

Snapshot menggambarkan keadaan dunia nyata pada periode tertentu.

---

## Table: real_world_states

| Field | Type | Description |
|---|---|---|
| state_id | UUID | ID state |
| year | INTEGER | Tahun |
| region_id | UUID | Wilayah |
| category | STRING | Kategori |
| metric | STRING | Nama data |
| value | JSON | Nilai |
| unit | STRING | Satuan |
| source_id | UUID | Sumber |
| confidence | STRING | Tingkat keyakinan |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |

---

## Categories

population
economy
technology
industry
transportation
communication
internet
education
health
energy
agriculture
finance
culture
society
environment
military
politics
science

---

## Example

year:

1996

category:

technology

metric:

internet_adoption

value:

{
    "type": "percentage",
    "value": 0
}

---

## Important

Value menggunakan JSON agar setiap kategori dapat memiliki struktur data berbeda.

Jangan memaksa semua data menjadi NUMBER.
