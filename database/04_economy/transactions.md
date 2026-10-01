# Transactions

Transaction menyimpan aktivitas ekonomi.

---

## Table: transactions

| Field | Type | Description |
|---|---|---|
| transaction_id | UUID | ID transaksi |
| world_id | UUID | Dunia |
| transaction_type | STRING | Tipe |
| sender_type | STRING | Pengirim |
| sender_id | UUID | Pengirim |
| receiver_type | STRING | Penerima |
| receiver_id | UUID | Penerima |
| amount | NUMBER | Nilai |
| currency | STRING | Mata uang |
| occurred_at | DATETIME | Waktu FFS |
| reference_type | STRING | Referensi |
| reference_id | UUID | Referensi |
| created_at | DATETIME | Dibuat |

---

## Examples

sale
purchase
salary
tax
investment
loan
rent
dividend
production
transport

---

## Important

Current balance bukan sumber sejarah.

Transaction adalah catatan bagaimana balance berubah.
