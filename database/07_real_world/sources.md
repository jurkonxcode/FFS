# Real World Sources

Setiap data dunia nyata yang penting harus dapat dilacak ke sumbernya.

---

## Table: real_world_sources

| Field | Type | Description |
|---|---|---|
| source_id | UUID | ID |
| organization | STRING | Organisasi |
| title | STRING | Judul sumber |
| url | STRING | URL |
| publication_date | DATETIME | Tanggal publikasi |
| accessed_at | DATETIME | Tanggal akses |
| data_category | STRING | Kategori |
| notes | TEXT | Catatan |
| created_at | DATETIME | Dibuat |

---

## Source Priority

Prioritas sumber:

1. Official government data
2. International organizations
3. Official company records
4. Academic sources
5. Established historical databases
6. Reliable secondary sources

---

## Important

Sumber tidak disimpan hanya sebagai URL.

Source metadata juga harus disimpan agar data dapat diaudit.
