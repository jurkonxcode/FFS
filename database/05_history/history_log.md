# History Log

History Log menyimpan perubahan penting dunia.

---

## Table: history_logs

| Field | Type | Description |
|---|---|---|
| history_id | UUID | ID |
| world_id | UUID | Dunia |
| event_id | UUID | Event |
| entity_type | STRING | Entity |
| entity_id | UUID | Entity ID |
| action | STRING | Aksi |
| old_state | JSON | Kondisi sebelumnya |
| new_state | JSON | Kondisi baru |
| occurred_at | DATETIME | Waktu FFS |
| created_at | DATETIME | Dibuat |

---

## Example

Company:

Nokia

Action:

company_founded

atau:

Company acquired

old_state:

{
  "status": "active"
}

new_state:

{
  "status": "acquired"
}
