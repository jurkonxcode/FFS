# Buildings

## Table: buildings

| Field | Type | Description |
|---|---|---|
| building_id | UUID | ID bangunan |
| world_id | UUID | Dunia |
| location_id | UUID | Lokasi |
| owner_type | STRING | Tipe pemilik |
| owner_id | UUID | ID pemilik |
| building_type | STRING | Jenis bangunan |
| level | INTEGER | Level |
| condition | NUMBER | Kondisi |
| status | STRING | Status |
| created_at | DATETIME | Waktu dibuat |
| updated_at | DATETIME | Perubahan |

---

## Examples

house
shop
factory
warehouse
office
school
hospital
restaurant
farm

---

## Important

Building tidak menyimpan detail company langsung.

Jika dimiliki perusahaan:

owner_type = company

owner_id = company_id
