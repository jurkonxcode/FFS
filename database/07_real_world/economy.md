# Real World Economy

Database ekonomi dunia nyata.

---

## Table: real_world_economy

| Field | Type | Description |
|---|---|---|
| economy_id | UUID | ID |
| year | INTEGER | Tahun |
| country_id | UUID | Negara |
| indicator | STRING | Indikator |
| value | NUMBER | Nilai |
| unit | STRING | Satuan |
| source_id | UUID | Sumber |
| created_at | DATETIME | Dibuat |

---

## Indicators

gdp
gdp_per_capita
inflation
unemployment
interest_rate
currency_value
exports
imports
population
industrial_output
energy_consumption

---

## Important

Data ekonomi dunia nyata digunakan sebagai baseline.

FFS Economy Engine dapat menghasilkan kondisi berbeda setelah terjadi divergence.
