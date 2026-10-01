# Player

Player adalah manusia yang memainkan FFS.

Player berbeda dengan Character.

---

## Table: players

| Field | Type | Description |
|---|---|---|
| player_id | UUID | ID player |
| username | STRING | Username |
| preferred_language | STRING | Bahasa UI |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |

---

## Relationship

Player
↓
Legacy
↓
Character
↓
Family
↓
Descendants

Player dapat berpindah dari satu character ke character lain.
