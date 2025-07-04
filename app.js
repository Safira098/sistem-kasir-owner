const express = require('express');
const mysql = require('mysql2/promise'); // Menggunakan mysql2/promise untuk async/await
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt'); // Pastikan bcrypt sudah di-require
const app = express();
const port = 3000;

// Konfigurasi koneksi database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smarttill new' 
};

let pool; // Gunakan connection pool

async function connectToDatabase() {
    try {
        pool = mysql.createPool(dbConfig); // Buat connection pool
        console.log('Connected to MySQL database: smarttill new');
    } catch (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1); // Keluar dari aplikasi jika koneksi database gagal
    }
}

connectToDatabase();

// Middleware
app.use(bodyParser.json()); // Untuk parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Untuk parse application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'public')));


// === Middleware untuk Autentikasi ===
const authenticateUser = async (req, res, next) => {
    // req.headers['x-username'] untuk GET biasa, req.query['x-username'] untuk download link
    const username = req.headers['x-username'] || req.query['x-username'];

    if (username) {
        try {
            const [users] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
            if (users.length > 0) {
                req.user = users[0];
                next();
            } else {
                res.status(401).json({ message: 'Unauthorized: Invalid user credentials.' });
            }
        } catch (error) {
            console.error('Authentication error in middleware:', error);
            res.status(500).json({ message: 'Internal server error during authentication check.' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized: No user credentials provided.' });
    }
};


// Endpoint untuk registrasi
app.post('/api/register', async (req, res) => {
    const { namaLengkap, userID, noTelpon, role, password } = req.body;

    if (!namaLengkap || !userID || !role || !password) {
        return res.status(400).json({ message: 'Semua field wajib diisi (kecuali Nomor Telepon).' });
    }

    try {
        const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', [userID]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'User ID sudah digunakan.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.execute(
            'INSERT INTO users (nama_lengkap, username, no_telpon, role, password) VALUES (?, ?, ?, ?, ?)',
            [namaLengkap, userID, noTelpon, role, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
            username: userID
        });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
});

// Endpoint untuk login
app.post('/api/login', async (req, res) => {
    const { userID, password } = req.body;

    if (!userID || !password) {
        return res.status(400).json({ message: 'User ID dan password wajib diisi.' });
    }

    try {
        const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [userID]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid User ID or password' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid User ID or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: { userID: user.username, role: user.role },
            redirectTo: 'dashboard.html'
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});

// ... (kode app.js Anda yang lain, seperti koneksi database, middleware, dll.) ...

// === Endpoint untuk mengambil data profil pengguna ===
app.get('/api/profile', authenticateUser, async (req, res) => {
    const username = req.query.username; // Ambil username dari query parameter

    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }

    try {
        // Pastikan Anda memilih semua kolom yang relevan, termasuk 'role'
        const [users] = await pool.execute(
            'SELECT nama_lengkap, username, no_telpon, role FROM users WHERE username = ?',
            [username]
        );

        if (users.length > 0) {
            res.json(users[0]); // Kirim data pengguna pertama yang ditemukan
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Failed to fetch user profile.', details: error.message });
    }
});

// === Endpoint untuk memperbarui data profil pengguna ===
app.put('/api/profile/update', authenticateUser, async (req, res) => {
    // currentUsername adalah username yang sedang login (sebelum diedit)
    // newUsername adalah username yang baru (jika diganti)
    const { currentUsername, namaLengkap, newUsername, noTelpon, role, oldPassword, newPassword } = req.body;

    // Validasi input dasar
    if (!currentUsername || !namaLengkap || !newUsername || !role) {
        return res.status(400).json({ message: 'Nama Lengkap, Username baru, dan Role wajib diisi.' });
    }

    try {
        // Bangun query UPDATE secara dinamis
        let updateQuery = 'UPDATE users SET nama_lengkap = ?, username = ?, no_telpon = ?, role = ?';
        const updateParams = [namaLengkap, newUsername, noTelpon, role];

        // Cek apakah username baru sudah digunakan oleh user lain (jika username berubah)
        if (currentUsername !== newUsername) {
            const [existingUsers] = await pool.execute('SELECT id FROM users WHERE username = ? AND username != ?', [newUsername, currentUsername]);
            if (existingUsers.length > 0) {
                return res.status(409).json({ message: 'Username baru sudah digunakan oleh pengguna lain.' });
            }
        }

        // Logika untuk perubahan password (jika ada)
        if (oldPassword || newPassword) { // Cek jika salah satu field password diisi
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Untuk mengubah kata sandi, kata sandi lama dan kata sandi baru harus diisi.' });
            }
            
            // Ambil password user dari database untuk verifikasi password lama
            const [users] = await pool.execute('SELECT password FROM users WHERE username = ?', [currentUsername]);
            if (users.length === 0) {
                return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
            }
            const user = users[0];
            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Kata sandi lama salah.' });
            }

            // Hash password baru dan tambahkan ke query update
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            updateQuery += ', password = ?';
            updateParams.push(hashedPassword);
        }

        // Tambahkan kondisi WHERE untuk mengidentifikasi user yang akan diupdate
        updateQuery += ' WHERE username = ?';
        updateParams.push(currentUsername); // Gunakan username lama untuk WHERE clause

        // Eksekusi query update
        const [result] = await pool.execute(updateQuery, updateParams);

        if (result.affectedRows > 0) {
            // Jika username berubah, kirim username baru agar frontend bisa memperbarui localStorage
            res.status(200).json({ message: 'Profil berhasil diperbarui.', updatedUsername: newUsername });
        } else {
            // Jika tidak ada baris yang terpengaruh, bisa berarti user tidak ditemukan atau tidak ada perubahan data
            res.status(200).json({ message: 'Tidak ada perubahan pada profil.' }); 
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Gagal memperbarui profil.', details: error.message });
    }
});

// === Endpoint untuk mengambil data BARANG (termasuk jumlah terjual) ===
// *DIPERBAIKI UNTUK FILTER BULAN/TAHUN/TANGGAL*
app.get('/api/barang', authenticateUser, async (req, res) => {
    const { search, bulan, tahun, tanggal } = req.query; // Ambil parameter filter tanggal dari query

    let query = `
        SELECT
            b.id AS id_barang,
            b.kode_barang,
            b.nama_barang,
            b.stok_awal,
            b.harga_modal,
            b.id_kategori,
            k.nama_kategori,
            b.created_at,
            b.updated_at,
            COALESCE(SUM(n.jumlah), 0) AS total_sold_quantity_from_nota
        FROM
            barang b
        LEFT JOIN
            kategori k ON b.id_kategori = k.id
        LEFT JOIN
            nota n ON b.id = n.id_barang
        LEFT JOIN
            transaksi t ON n.id_transaksi = t.id -- Join dengan tabel transaksi untuk filter tanggal penjualan
        WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
        query += ` AND (b.nama_barang LIKE ? OR b.kode_barang LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (bulan && tahun) {
        query += ` AND MONTH(b.created_at) = ? AND YEAR(b.created_at) = ?`;
        queryParams.push(parseInt(bulan), parseInt(tahun));
    } else if (tanggal) {
        // Filter berdasarkan tanggal pembuatan barang (b.created_at)
        query += ` AND DATE(b.created_at) = ?`;
        queryParams.push(tanggal);
    }

    query += ` GROUP BY b.id, b.kode_barang, b.nama_barang, b.stok_awal, b.harga_modal, b.id_kategori, k.nama_kategori, b.created_at, b.updated_at`;
    query += ` ORDER BY b.id ASC`;

    try {
        console.log('Executing barang query:', query, queryParams); // Log query untuk debugging
        const [results] = await pool.execute(query, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error fetching barang data:', error);
        res.status(500).json({ error: 'Failed to fetch barang data from database.', details: error.message });
    }
});


// === Endpoint untuk mengambil jumlah KATEGORI ==
app.get('/api/kategori-count', authenticateUser, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT COUNT(*) AS total_categories FROM kategori');
        const totalCategories = rows[0].total_categories;
        res.json({ count: totalCategories });
    } catch (error) {
        console.error('Error fetching kategori count:', error);
        res.status(500).json({ error: 'Failed to fetch category count from database.', details: error.message });
    }
});

// === Endpoint: Untuk mengambil total jumlah transaksi ===
app.get('/api/total-transaksi', authenticateUser, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT COUNT(id) AS total_transactions FROM transaksi');
        const totalTransactions = rows[0].total_transactions;
        res.json({ count: totalTransactions });
    } catch (error) {
        console.error('Error fetching total transactions:', error);
        res.status(500).json({ error: 'Failed to fetch total transactions from database.', details: error.message });
    }
});

// === Endpoint: Untuk mengambil total barang terjual (kuantitas) dari tabel NOTA (untuk dashboard) ===
app.get('/api/barang-terjual-count', authenticateUser, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT COALESCE(SUM(jumlah), 0) AS total_sold_quantity FROM nota');
        const totalSoldQuantity = rows[0].total_sold_quantity || 0;
        res.json({ count: totalSoldQuantity });
    } catch (error) {
        console.error('Error fetching total sold items from nota:', error);
        res.status(500).json({ error: 'Failed to fetch total sold items from database (nota table).', details: error.message });
    }
});


// === Endpoint untuk mengambil data Laporan Penjualan ===
app.get('/api/penjualan', authenticateUser, async (req, res) => {
    const { bulan, tahun, tanggal, search } = req.query;

    let query = `
        SELECT
            n.id_transaksi,
            t.created_at AS tanggal_penjualan, -- Menggunakan created_at sebagai tanggal_penjualan
            t.status_transaksi,
            n.id_barang,
            b.nama_barang,
            n.jumlah,
            n.harga_satuan,
            b.harga_modal AS harga_pokok,
            (n.jumlah * n.harga_satuan) AS total_tagihan
        FROM
            nota n
        JOIN
            barang b ON n.id_barang = b.id
        JOIN
            transaksi t ON n.id_transaksi = t.id
        WHERE 1=1
    `;
    const queryParams = [];

    if (bulan && tahun) {
        query += ` AND MONTH(t.created_at) = ? AND YEAR(t.created_at) = ?`; // Filter berdasarkan created_at
        queryParams.push(parseInt(bulan), parseInt(tahun));
    }
    if (tanggal) {
        query += ` AND DATE(t.created_at) = ?`; // Filter berdasarkan created_at
        queryParams.push(tanggal);
    }
    if (search) {
        query += ` AND (b.nama_barang LIKE ? OR n.id_transaksi LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY n.id_transaksi ASC`; // Diurutkan berdasarkan ID Transaksi terkecil

    try {
        console.log('Executing penjualan query:', query, queryParams);
        const [results] = await pool.execute(query, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error fetching penjualan data:', error);
        res.status(500).json({ message: 'Failed to fetch sales data from database.', details: error.message });
    }
});

// === Endpoint untuk Download Laporan Penjualan (CSV) ===
app.get('/api/penjualan/download', authenticateUser, async (req, res) => {
    const { bulan, tahun, tanggal, search } = req.query;

    let query = `
        SELECT
            n.id_transaksi AS 'ID Transaksi',
            b.nama_barang AS 'Nama Barang',
            n.jumlah AS 'Jumlah (QTY)',
            n.harga_satuan AS 'Harga Satuan',
            (n.jumlah * n.harga_satuan) AS 'Total Tagihan',
            (n.jumlah * n.harga_satuan) - (n.jumlah * b.harga_modal) AS 'Keuntungan',
            DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') AS 'Tanggal Penjualan', -- Menggunakan created_at
            t.status_transaksi AS 'Status Transaksi'
        FROM
            nota n
        JOIN
            barang b ON n.id_barang = b.id
        JOIN
            transaksi t ON n.id_transaksi = t.id
        WHERE 1=1
    `;
    const queryParams = [];

    if (bulan && tahun) {
        query += ` AND MONTH(t.created_at) = ? AND YEAR(t.created_at) = ?`; // Filter berdasarkan created_at
        queryParams.push(parseInt(bulan), parseInt(tahun));
    }
    if (tanggal) {
        query += ` AND DATE(t.created_at) = ?`; // Filter berdasarkan created_at
        queryParams.push(tanggal);
    }
    if (search) {
        query += ` AND (b.nama_barang LIKE ? OR n.id_transaksi LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY n.id_transaksi ASC`; // Diurutkan berdasarkan ID Transaksi terkecil untuk download

    try {
        const [results] = await pool.execute(query, queryParams);

        if (results.length === 0) {
            return res.status(404).send('No data found for download based on current filters.');
        }

        const csvRows = [];
        const headers = Object.keys(results[0]).join(',');
        csvRows.push(headers);

        results.forEach(row => {
            const values = Object.values(row).map(value => {
                if (value === null || typeof value === 'undefined') {
                    return '';
                }
                // Convert numbers to string to avoid issues with CSV formatting if they contain commas
                if (typeof value === 'number') {
                    value = String(value);
                }
                // Handle values that contain commas, double quotes, or newlines
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
            csvRows.push(values);
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('laporan_penjualan.csv');
        res.send(csvRows.join('\n'));

    } catch (error) {
        console.error('Error generating sales download:', error);
        res.status(500).json({ message: 'Failed to generate sales report for download.', details: error.message });
    }
});

// Endpoint untuk Download Laporan Barang (CSV)
app.get('/api/barang/download', authenticateUser, async (req, res) => {
    const { search, bulan, tahun, tanggal } = req.query; // Ambil parameter filter tanggal dari query

    let query = `
        SELECT
            b.id AS 'ID Barang',
            b.kode_barang AS 'Kode Barang',
            b.nama_barang AS 'Nama Barang',
            b.stok_awal AS 'Stok Awal',
            b.harga_modal AS 'Harga Modal',
            k.nama_kategori AS 'Kategori',
            DATE_FORMAT(b.created_at, '%Y-%m-%d %H:%i:%s') AS 'Tanggal Dibuat',
            DATE_FORMAT(b.updated_at, '%Y-%m-%d %H:%i:%s') AS 'Tanggal Diperbarui',
            COALESCE(SUM(n.jumlah), 0) AS 'Jumlah Terjual'
        FROM
            barang b
        LEFT JOIN
            kategori k ON b.id_kategori = k.id
        LEFT JOIN
            nota n ON b.id = n.id_barang
        LEFT JOIN
            transaksi t ON n.id_transaksi = t.id -- Join dengan tabel transaksi untuk filter tanggal penjualan (jika diperlukan)
        WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
        query += ` AND (b.nama_barang LIKE ? OR b.kode_barang LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (bulan && tahun) {
        // Filter berdasarkan tanggal dibuatnya barang (b.created_at)
        query += ` AND MONTH(b.created_at) = ? AND YEAR(b.created_at) = ?`;
        queryParams.push(parseInt(bulan), parseInt(tahun));
    } else if (tanggal) {
        // Filter berdasarkan tanggal dibuatnya barang (b.created_at)
        query += ` AND DATE(b.created_at) = ?`;
        queryParams.push(tanggal);
    }

    query += ` GROUP BY b.id, b.kode_barang, b.nama_barang, b.stok_awal, b.harga_modal, b.id_kategori, k.nama_kategori, b.created_at, b.updated_at`;
    query += ` ORDER BY b.id ASC`;

    try {
        console.log('Executing barang download query:', query, queryParams); // Log query untuk debugging
        const [results] = await pool.execute(query, queryParams);

        if (results.length === 0) {
            return res.status(404).send('No data found for download based on current filters.');
        }

        const csvRows = [];
        const headers = Object.keys(results[0]).join(',');
        csvRows.push(headers);

        results.forEach(row => {
            const values = Object.values(row).map(value => {
                if (value === null || typeof value === 'undefined') {
                    return '';
                }
                // Convert numbers to string to avoid issues with CSV formatting
                if (typeof value === 'number') {
                    value = String(value);
                }
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
            csvRows.push(values);
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('laporan_barang.csv');
        res.send(csvRows.join('\n'));

    } catch (error) {
        console.error('Error generating barang download:', error);
        res.status(500).json({ message: 'Failed to generate barang report for download.', details: error.message });
    }
});


// === Endpoint untuk mengambil data Laporan Pembelian ===
app.get('/api/pembelian', authenticateUser, async (req, res) => {
    const { bulan, tahun, tanggal, search } = req.query;

    let query = `
        SELECT
            np.id AS id_nota_pembelian,
            p.id AS id_pembelian,
            s.nama_supplier AS supplier_name,
            b.id AS id_barang,
            b.nama_barang,
            np.jumlah,
            np.harga_beli AS harga_beli_satuan,
            (np.jumlah * np.harga_beli) AS total_pembelian_item,
            p.tanggal_penerima AS tanggal_pembelian, -- Menggunakan tanggal_penerima sebagai tanggal pembelian
            p.status AS status_pembelian
        FROM
            nota_pembelian np
        JOIN
            pembelian p ON np.id_pembelian = p.id
        JOIN
            barang b ON np.id_barang = b.id
        LEFT JOIN
            supplier s ON p.id_supplier = s.id
        WHERE 1=1
    `;
    const queryParams = [];

    if (bulan && tahun) {
        query += ` AND MONTH(p.tanggal_penerima) = ? AND YEAR(p.tanggal_penerima) = ?`;
        queryParams.push(parseInt(bulan), parseInt(tahun));
    }
    if (tanggal) {
        query += ` AND DATE(p.tanggal_penerima) = ?`;
        queryParams.push(tanggal);
    }
    if (search) {
        query += ` AND (b.nama_barang LIKE ? OR p.id LIKE ? OR s.nama_supplier LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.tanggal_penerima DESC, np.id ASC`; // Urutkan berdasarkan tanggal penerima terbaru, lalu ID nota pembelian

    try {
        console.log('Executing pembelian query:', query, queryParams);
        const [results] = await pool.execute(query, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error fetching pembelian data:', error);
        res.status(500).json({ message: 'Failed to fetch purchase data from database.', details: error.message });
    }
});

// === Endpoint untuk Download Laporan Pembelian (CSV) ===
app.get('/api/pembelian/download', authenticateUser, async (req, res) => {
    const { bulan, tahun, tanggal, search } = req.query;

    let query = `
        SELECT
            p.id AS 'ID Pembelian',
            s.nama_supplier AS 'Nama Supplier',
            b.nama_barang AS 'Nama Barang',
            np.jumlah AS 'Jumlah (QTY)',
            np.harga_beli AS 'Harga Beli Satuan',
            (np.jumlah * np.harga_beli) AS 'Total Pembelian Item',
            DATE_FORMAT(p.tanggal_penerima, '%Y-%m-%d %H:%i:%s') AS 'Tanggal Pembelian',
            p.status AS 'Status Pembelian'
        FROM
            nota_pembelian np
        JOIN
            pembelian p ON np.id_pembelian = p.id
        JOIN
            barang b ON np.id_barang = b.id
        LEFT JOIN
            supplier s ON p.id_supplier = s.id
        WHERE 1=1
    `;
    const queryParams = [];

    if (bulan && tahun) {
        query += ` AND MONTH(p.tanggal_penerima) = ? AND YEAR(p.tanggal_penerima) = ?`;
        queryParams.push(parseInt(bulan), parseInt(tahun));
    }
    if (tanggal) {
        query += ` AND DATE(p.tanggal_penerima) = ?`;
        queryParams.push(tanggal);
    }
    if (search) {
        query += ` AND (b.nama_barang LIKE ? OR p.id LIKE ? OR s.nama_supplier LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.tanggal_penerima DESC, np.id ASC`;

    try {
        const [results] = await pool.execute(query, queryParams);

        if (results.length === 0) {
            return res.status(404).send('No data found for download based on current filters.');
        }

        const csvRows = [];
        const headers = Object.keys(results[0]).join(',');
        csvRows.push(headers);

        results.forEach(row => {
            const values = Object.values(row).map(value => {
                if (value === null || typeof value === 'undefined') {
                    return '';
                }
                if (typeof value === 'number') {
                    value = String(value);
                }
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
            csvRows.push(values);
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('laporan_pembelian.csv');
        res.send(csvRows.join('\n'));

    } catch (error) {
        console.error('Error generating purchase download:', error);
        res.status(500).json({ message: 'Failed to generate purchase report for download.', details: error.message });
    }
});

// === Endpoint untuk mengambil data Laporan Keuangan (Gabungan Penjualan dan Pembelian) ===
app.get('/api/keuangan', authenticateUser, async (req, res) => {
    const { bulan, tahun, tanggal, search } = req.query;
    const queryParams = [];
    
    // Base query for sales (penjualan)
    let salesQuery = `
        SELECT
            t.created_at AS tanggal_transaksi,
            CONCAT('Penjualan Barang: ', b.nama_barang, ' (ID Transaksi: ', n.id_transaksi, ')') AS deskripsi,
            'Penjualan' AS tipe,
            t.metode_pembayaran AS metode_pembayaran,
            (n.jumlah * n.harga_satuan) AS uang_masuk,
            0.00 AS uang_keluar,
            (n.jumlah * n.harga_satuan) - (n.jumlah * b.harga_modal) AS keuntungan_item
        FROM
            nota n
        JOIN
            barang b ON n.id_barang = b.id
        JOIN
            transaksi t ON n.id_transaksi = t.id
        WHERE 1=1
    `;
    
    // Base query for purchases (pembelian)
    let purchaseQuery = `
        SELECT
            p.tanggal_penerima AS tanggal_transaksi,
            CONCAT('Pembelian Barang: ', b.nama_barang, ' (ID Pembelian: ', p.id, ', Supplier: ', COALESCE(s.nama_supplier, 'N/A'), ')') AS deskripsi,
            'Pembelian' AS tipe,
            'Tunai/Transfer' AS metode_pembayaran, -- Asumsi metode pembayaran untuk pembelian
            0.00 AS uang_masuk,
            (np.jumlah * np.harga_beli) AS uang_keluar,
            -(np.jumlah * np.harga_beli) AS keuntungan_item -- Pengeluaran dihitung sebagai keuntungan negatif
        FROM
            nota_pembelian np
        JOIN
            pembelian p ON np.id_pembelian = p.id
        JOIN
            barang b ON np.id_barang = b.id
        LEFT JOIN
            supplier s ON p.id_supplier = s.id
        WHERE 1=1
    `;

    // Apply filters to both queries
    if (bulan && tahun) {
        salesQuery += ` AND MONTH(t.created_at) = ? AND YEAR(t.created_at) = ?`;
        purchaseQuery += ` AND MONTH(p.tanggal_penerima) = ? AND YEAR(p.tanggal_penerima) = ?`;
        queryParams.push(parseInt(bulan), parseInt(tahun), parseInt(bulan), parseInt(tahun));
    }
    if (tanggal) {
        salesQuery += ` AND DATE(t.created_at) = ?`;
        purchaseQuery += ` AND DATE(p.tanggal_penerima) = ?`;
        queryParams.push(tanggal, tanggal);
    }
    if (search) {
        const searchLike = `%${search}%`;
        salesQuery += ` AND (b.nama_barang LIKE ? OR n.id_transaksi LIKE ? OR t.metode_pembayaran LIKE ?)`;
        purchaseQuery += ` AND (b.nama_barang LIKE ? OR p.id LIKE ? OR s.nama_supplier LIKE ?)`;
        queryParams.push(searchLike, searchLike, searchLike, searchLike, searchLike, searchLike);
    }

    // Combine queries using UNION ALL and order by transaction date
    let finalQuery = `
        (${salesQuery})
        UNION ALL
        (${purchaseQuery})
        ORDER BY tanggal_transaksi DESC
    `;

    try {
        console.log('Executing keuangan query:', finalQuery, queryParams);
        const [results] = await pool.execute(finalQuery, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error fetching keuangan data:', error);
        res.status(500).json({ message: 'Failed to fetch financial data from database.', details: error.message });
    }
});

// === Endpoint untuk Download Laporan Keuangan (CSV) ===
app.get('/api/keuangan/download', authenticateUser, async (req, res) => {
    const { bulan, tahun, tanggal, search } = req.query;
    const queryParams = [];

    // Base query for sales (penjualan)
    let salesQuery = `
        SELECT
            DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') AS 'Tanggal Transaksi',
            CONCAT('Penjualan Barang: ', b.nama_barang, ' (ID Transaksi: ', n.id_transaksi, ')') AS 'Deskripsi',
            'Penjualan' AS 'Tipe',
            t.metode_pembayaran AS 'Metode Pembayaran',
            (n.jumlah * n.harga_satuan) AS 'Uang Masuk',
            0.00 AS 'Uang Keluar',
            (n.jumlah * n.harga_satuan) - (n.jumlah * b.harga_modal) AS 'Keuntungan Item'
        FROM
            nota n
        JOIN
            barang b ON n.id_barang = b.id
        JOIN
            transaksi t ON n.id_transaksi = t.id
        WHERE 1=1
    `;

    // Base query for purchases (pembelian)
    let purchaseQuery = `
        SELECT
            DATE_FORMAT(p.tanggal_penerima, '%Y-%m-%d %H:%i:%s') AS 'Tanggal Transaksi',
            CONCAT('Pembelian Barang: ', b.nama_barang, ' (ID Pembelian: ', p.id, ', Supplier: ', COALESCE(s.nama_supplier, 'N/A'), ')') AS 'Deskripsi',
            'Pembelian' AS 'Tipe',
            'Tunai/Transfer' AS 'Metode Pembayaran', -- Asumsi metode pembayaran untuk pembelian
            0.00 AS 'Uang Masuk',
            (np.jumlah * np.harga_beli) AS 'Uang Keluar',
            -(np.jumlah * np.harga_beli) AS 'Keuntungan Item' -- Pengeluaran dihitung sebagai keuntungan negatif
        FROM
            nota_pembelian np
        JOIN
            pembelian p ON np.id_pembelian = p.id
        JOIN
            barang b ON np.id_barang = b.id
        LEFT JOIN
            supplier s ON p.id_supplier = s.id
        WHERE 1=1
    `;

    // Apply filters to both queries
    if (bulan && tahun) {
        salesQuery += ` AND MONTH(t.created_at) = ? AND YEAR(t.created_at) = ?`;
        purchaseQuery += ` AND MONTH(p.tanggal_penerima) = ? AND YEAR(p.tanggal_penerima) = ?`;
        queryParams.push(parseInt(bulan), parseInt(tahun), parseInt(bulan), parseInt(tahun));
    }
    if (tanggal) {
        salesQuery += ` AND DATE(t.created_at) = ?`;
        purchaseQuery += ` AND DATE(p.tanggal_penerima) = ?`;
        queryParams.push(tanggal, tanggal);
    }
    if (search) {
        const searchLike = `%${search}%`;
        salesQuery += ` AND (b.nama_barang LIKE ? OR n.id_transaksi LIKE ? OR t.metode_pembayaran LIKE ?)`;
        purchaseQuery += ` AND (b.nama_barang LIKE ? OR p.id LIKE ? OR s.nama_supplier LIKE ?)`;
        queryParams.push(searchLike, searchLike, searchLike, searchLike, searchLike, searchLike);
    }

    // Combine queries using UNION ALL and order by transaction date
    let finalQuery = `
        (${salesQuery})
        UNION ALL
        (${purchaseQuery})
        ORDER BY 'Tanggal Transaksi' DESC
    `;

    try {
        const [results] = await pool.execute(finalQuery, queryParams);

        if (results.length === 0) {
            return res.status(404).send('No data found for download based on current filters.');
        }

        const csvRows = [];
        const headers = Object.keys(results[0]).join(',');
        csvRows.push(headers);

        results.forEach(row => {
            const values = Object.values(row).map(value => {
                if (value === null || typeof value === 'undefined') {
                    return '';
                }
                if (typeof value === 'number') {
                    value = String(value);
                }
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
            csvRows.push(values);
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('laporan_keuangan.csv');
        res.send(csvRows.join('\n'));

    } catch (error) {
        console.error('Error generating keuangan download:', error);
        res.status(500).json({ message: 'Failed to generate financial report for download.', details: error.message });
    }
});


// Mulai server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Access login page at http://localhost:${port}/login.html`);
});
