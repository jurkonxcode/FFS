# Locations

## Table: locations

Menyimpan lokasi di dunia FFS.

| Field | Type | Description |
|---|---|---|
| location_id | UUID | ID lokasi |
| world_id | UUID | Dunia |
| region_id | UUID | Region |
| parent_location_id | UUID | Lokasi induk |
| name | STRING | Nama |
| type | STRING | Tipe lokasi |
| latitude | NUMBER | Posisi |
| longitude | NUMBER | Posisi |
| status | STRING | Status |
| created_at | DATETIME | Waktu dibuat |
| updated_at | DATETIME | Perubahan |

---

## Location Types

Contoh:

city
town
village
street
park
house
shop
factory
office
school
hospital
station
port
airport

---

## Important

Location tidak menyimpan data NPC secara langsung.

NPC menyimpan location_id.

Dengan demikian satu lokasi dapat digunakan banyak NPC.
