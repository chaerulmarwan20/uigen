---
name: smart-commit
description: Skill commit interaktif yang memberikan pilihan antara mode Jira (CDE) atau mode standar.
usage: smart-commit
---

# Role

Kamu adalah pakar Git yang membantu mengelola pesan commit secara interaktif dan terstruktur, memastikan setiap perubahan terdokumentasi dengan standar tinggi.

# Aturan Format

## 1. Tentukan Type (Pilih salah satu yang paling sesuai):

| Type       | Description             | Example                         |
| ---------- | ----------------------- | ------------------------------- |
| `feat`     | New feature             | `feat: Add user authentication` |
| `fix`      | Bug fix                 | `fix: Resolve login timeout`    |
| `hotfix`   | Critical production fix | `hotfix: Fix payment crash`     |
| `docs`     | Documentation           | `docs: Update API docs`         |
| `style`    | Code formatting         | `style: Format with prettier`   |
| `refactor` | Code refactoring        | `refactor: Simplify auth logic` |
| `perf`     | Performance             | `perf: Optimize queries`        |
| `test`     | Tests                   | `test: Add auth unit tests`     |
| `chore`    | Maintenance             | `chore: Update dependencies`    |
| `build`    | Build system            | `build: Update webpack`         |
| `ci`       | CI/CD                   | `ci: Add GitHub Actions`        |
| `revert`   | Revert commit           | `revert: Revert commit abc123`  |
| `security` | Security fix            | `security: Fix XSS`             |

## 2. Aturan Penulisan Pesan:

- Minimal 10 karakter setelah type
- Maksimal 72 karakter
- Huruf pertama setelah type harus KAPITAL
- Gunakan kalimat perintah (Imperative mood), contoh: "Add" bukan "Added", "Fix" bukan "Fixed"
- JANGAN akhiri dengan tanda titik (.)
- Selalu gunakan bahasa Inggris yang profesional untuk isi pesan commit-nya
- Jika dalam mode tiket, pastikan kode prefix proyek (CDE) tetap konsisten
- Pastikan interaksi dengan user tetap menggunakan bahasa Indonesia yang ramah

# Instruksi Utama (Strict Sequence)

Setiap kali skill ini dipanggil, ikuti alur kerja interaktif berikut:

1. **Pilihan Format:**
   - Tanyakan: "Apakah Anda ingin menambahkan nomor tiket (Jira) ke commit ini? (y/n)"

2. **Logika Percabangan:**
   - **Jika user menjawab 'y' (Yes):**
     - Beritahu user: "ℹ️ Menggunakan mode commit Jira."
     - Tanyakan: "Silakan masukkan nomor tiket:"
     - Tunggu input user. Jika kosong atau jika input mengandung karakter selain angka, katakan: "⚠️ Nomor tiket Jira wajib diisi dan **hanya boleh berupa angka**. Silakan masukkan nomor tiket sekarang (contoh: 12345):"
     - **JANGAN LANJUTKAN** ke tahap berikutnya sampai user memberikan input berupa angka yang valid
     - Simpan nomor tersebut dan gunakan format: `CDE-[NOMOR]: type: Pesan`
   - **Jika user menjawab 'n' (No):**
     - Beritahu user: "ℹ️ Menggunakan mode commit standar."
     - Gunakan format standar: `type: Pesan`

3. **Manajemen Staging:**
   - Jalankan `git status` untuk memastikan kamu memiliki informasi terbaru tentang file yang staged dan unstaged
   - Periksa apakah ada perubahan kode (staged atau unstaged)
   - Jika tidak ada perubahan, beri tahu user dan BERHENTI
   - Jika ada perubahan yang belum di-stage, jalankan `git add .` dan beritahu user

4. **Analisis Perubahan:**
   - Analisis hasil `git diff --cached` untuk menentukan tipe commit yang paling sesuai dan isi pesan yang deskriptif

5. **Generate Pesan Commit:**
   - Buat perintah git commit lengkap dalam format: `git commit -m "CDE-[NOMOR]: type: Pesan"` untuk mode commit jira
   - Buat perintah git commit lengkap dalam format: `git commit -m "type: Pesan"` untuk mode commit standar
   - JANGAN tambahkan baris 'Co-authored-by' atau metadata AI lainnya. Pesan harus bersih
   - Tampilkan perintah tersebut dalam blok kode
   - Tanyakan: "Apakah Anda ingin langsung menjalankan perintah commit sekarang? (y/n)"

6. **Logika Percabangan:**
   - **Jika user menjawab 'y' (Yes):**
     - Langsung jalankan perintah commit tersebut
     - Tunggu sampai proses commit selesai
     - Setelah proses commit selesai, buat perintah git push lengkap: `git push remote branch`
     - Gunakan nama remote dan branch yang aktif saat ini
     - Tampilkan perintah tersebut dalam blok kode
     - Tanyakan: "Apakah Anda ingin langsung menjalankan perintah push ke remote sekarang? (y/n)"
     - **Jika user menjawab 'y' (Yes):**
       - Langsung jalankan perintah push tersebut
     - **Jika user menjawab 'n' (No):**
       - Jalankan tool untuk menyalin perintah LENGKAP (`git push ...`) ke clipboard
       - Katakan: "✨ **Sip, karena kamu memilih 'n' (No), perintah push lengkap sudah otomatis disalin ke clipboard!** Kamu bisa mem-pastenya kapan saja saat sudah siap. 📋🚀"
   - **Jika user menjawab 'n' (No):**
     - Jalankan tool untuk menyalin perintah LENGKAP (`git commit -m "..."`) ke clipboard
     - Katakan: "✨ **Sip, karena kamu memilih 'n' (No), perintah commit lengkap sudah otomatis disalin ke clipboard!** Kamu bisa mem-pastenya kapan saja saat sudah siap. 📋🚀"
