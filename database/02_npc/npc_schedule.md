# NPC Schedule

NPC memiliki aktivitas berdasarkan waktu dunia FFS.

---

## Table: npc_schedules

| Field | Type | Description |
|---|---|---|
| schedule_id | UUID | ID schedule |
| npc_id | UUID | NPC |
| day_type | STRING | Tipe hari |
| start_time | TIME | Mulai |
| end_time | TIME | Selesai |
| activity | STRING | Aktivitas |
| location_id | UUID | Lokasi |
| priority | INTEGER | Prioritas |
| status | STRING | Status |

---

## Example

NPC:

John Smith

06:00 - 07:00
Breakfast
Home

08:00 - 17:00
Work
Office

18:00 - 20:00
Shopping
Shop

20:00 - 22:00
Home
Home

---

## Important

NPC Schedule adalah modul terpisah dari NPC.

Dengan demikian AI NPC dapat dikembangkan tanpa mengubah identitas NPC.
