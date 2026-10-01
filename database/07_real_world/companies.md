# Real World Companies

Database perusahaan dunia nyata.

---

## Table: real_world_companies

| Field | Type | Description |
|---|---|---|
| real_company_id | UUID | ID |
| name | STRING | Nama perusahaan |
| country_id | UUID | Negara |
| founded_at | DATETIME | Berdiri |
| industry | STRING | Industri |
| status | STRING | Status |
| source_id | UUID | Sumber |
| created_at | DATETIME | Dibuat |
| updated_at | DATETIME | Diubah |

---

## Historical Company States

Kondisi perusahaan dapat berubah sepanjang waktu.

Contoh:

1996
company state A

2000
company state B

2005
company state C

---

## Table: real_company_states

| Field | Type | Description |
|---|---|---|
| state_id | UUID | ID |
| real_company_id | UUID | Perusahaan |
| year | INTEGER | Tahun |
| ownership | JSON | Kepemilikan |
| products | JSON | Produk |
| market | JSON | Pasar |
| employees | NUMBER | Karyawan |
| revenue | NUMBER | Pendapatan |
| status | STRING | Status |
| source_id | UUID | Sumber |

---

## Important

Real company data adalah historical reference.

FFS company state dapat diverge dari real company state.
