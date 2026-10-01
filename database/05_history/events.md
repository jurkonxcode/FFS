# World Events

Event adalah kejadian yang terjadi di dunia FFS.

---

## Table: world_events

| Field | Type | Description |
|---|---|---|
| event_id | UUID | ID event |
| world_id | UUID | Dunia |
| event_type | STRING | Jenis event |
| title | STRING | Judul |
| description | TEXT | Deskripsi |
| occurred_at | DATETIME | Waktu kejadian |
| location_id | UUID | Lokasi |
| importance | INTEGER | Tingkat kepentingan |
| source_type | STRING | Sumber |
| source_id | UUID | ID sumber |
| created_at | DATETIME | Dibuat |

---

## Event Types

birth
death
marriage
war
company_founded
company_closed
invention
discovery
economic_crisis
political_change
technology_change
player_action
natural_disaster
fantasy_event

---

## Important

Event adalah append-only history.

Event yang sudah terjadi tidak boleh diubah sembarangan.
