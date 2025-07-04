-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 03 Jul 2025 pada 03.11
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smarttill new`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `barang`
--

CREATE TABLE `barang` (
  `id` int(11) NOT NULL,
  `id_gudang` int(11) NOT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `kode_barang` int(11) DEFAULT NULL,
  `nama_barang` varchar(250) NOT NULL,
  `stok_awal` int(11) NOT NULL,
  `harga_modal` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `barang`
--

INSERT INTO `barang` (`id`, `id_gudang`, `id_kategori`, `kode_barang`, `nama_barang`, `stok_awal`, `harga_modal`, `created_at`, `updated_at`) VALUES
(2, 0, 1, 33325, 'odol', 5, 3000.00, '2025-06-25 11:35:15', NULL),
(3, 0, 1, 46778, 'tesss2', 6, 8000.00, '2025-06-25 11:42:15', NULL),
(4, 0, 1, 575757, 'igjgj', 6, 2000.00, '2025-06-25 11:45:45', NULL),
(5, 0, NULL, 6463637, 'katge', 5, 5000.00, '2025-06-25 13:07:16', NULL),
(6, 0, 3, 6373828, 'teskategori2', 6, 5000.00, '2025-06-25 13:07:53', NULL),
(7, 0, 1, 56272829, 'tessimpanbuat', 10, 6000.00, '2025-06-25 13:16:35', NULL),
(8, 0, NULL, 6277, 'tdddsss', 66, 3000.00, '2025-06-25 14:01:49', NULL),
(9, 0, NULL, 53728, 'tsgmbrpk', 20, 6000.00, '2025-06-25 14:04:58', '2025-06-26 01:22:09'),
(10, 0, NULL, 6272828, 'tesbrglhi', 50, 3000.00, '2025-06-25 15:14:55', '2025-06-26 01:21:41'),
(11, 0, NULL, 6272882, 'tesupdated', 60, 2000.00, '2025-06-25 15:42:34', '2025-06-26 01:21:22'),
(12, 0, NULL, 6267281, 'rinso', 5, 5000.00, '2025-06-26 01:09:28', '2025-07-02 23:31:23'),
(17, 0, 2, 627228, 'jaket', 12, 3000.00, '2025-06-26 17:41:44', '2025-07-01 13:57:48'),
(18, 0, NULL, 62728, 'aqua', 20, 2500.00, '2025-06-27 01:27:04', NULL),
(19, 0, NULL, 622728, 'tesktg', 6, 3000.00, '2025-06-27 02:19:49', NULL),
(20, 0, NULL, 637328, 'tes526', 15, 6000.00, '2025-06-27 10:24:19', '2025-07-02 23:28:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `harga_jual`
--

CREATE TABLE `harga_jual` (
  `id` int(11) NOT NULL,
  `id_barang` int(11) NOT NULL,
  `nama_harga` varchar(100) NOT NULL,
  `harga` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `harga_jual`
--

INSERT INTO `harga_jual` (`id`, `id_barang`, `nama_harga`, `harga`) VALUES
(2, 2, 'Eceran ', 5000.00),
(3, 3, 'Eceran', 12000.00),
(4, 4, 'Eceran', 5000.00),
(5, 5, 'Eceran', 6000.00),
(6, 6, 'Eceran', 6000.00),
(7, 7, 'Eceran', 9000.00),
(8, 8, 'Eceran', 6000.00),
(9, 9, 'Eceran', 0.00),
(10, 10, 'Eceran', 0.00),
(11, 11, 'Eceran', 0.00),
(12, 12, 'Eceran', 7000.00),
(14, 17, 'Eceran', 10000.00),
(15, 18, 'Kulak', 3500.00),
(16, 19, 'Eceran', 6000.00),
(17, 20, 'Eceran', 9000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id` int(10) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id`, `nama_kategori`, `created_at`, `update_at`) VALUES
(1, 'ATK', NULL, NULL),
(2, 'Makanan', NULL, NULL),
(3, 'Minuman', NULL, NULL),
(4, 'Snack', NULL, NULL),
(5, 'ciki', NULL, NULL),
(6, 'Pakaian', NULL, NULL),
(7, 'Jaket', NULL, NULL),
(8, 'elektronik', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `nota`
--

CREATE TABLE `nota` (
  `id` int(10) NOT NULL,
  `id_barang` int(10) DEFAULT NULL,
  `id_transaksi` int(20) NOT NULL,
  `nama_kasir` varchar(250) DEFAULT NULL,
  `nama_barang` varchar(250) DEFAULT NULL,
  `jumlah` int(10) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `harga_satuan` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `nota`
--

INSERT INTO `nota` (`id`, `id_barang`, `id_transaksi`, `nama_kasir`, `nama_barang`, `jumlah`, `total`, `harga_satuan`, `created_at`, `updated_at`) VALUES
(1, NULL, 1, NULL, 'Manual Input', 1, 9000.00, 9000.00, '2025-06-26 17:42:25', NULL),
(2, 17, 1, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-06-26 17:42:25', NULL),
(3, 17, 2, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-06-26 17:42:33', NULL),
(4, NULL, 3, NULL, 'Manual Input', 1, 9000.00, 9000.00, '2025-06-26 17:42:40', NULL),
(5, 2, 4, NULL, 'odol', 1, 5000.00, 5000.00, '2025-06-27 01:09:34', NULL),
(6, 3, 4, NULL, 'tesss2', 1, 12000.00, 12000.00, '2025-06-27 01:09:34', NULL),
(7, NULL, 4, NULL, 'Manual Input', 1, 15000.00, 15000.00, '2025-06-27 01:09:34', NULL),
(8, 18, 5, NULL, 'aqua', 1, 3500.00, 3500.00, '2025-06-27 01:28:17', NULL),
(9, NULL, 5, NULL, 'Manual Input', 1, 9000.00, 9000.00, '2025-06-27 01:28:17', NULL),
(10, 20, 6, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-27 13:30:05', NULL),
(11, 19, 6, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-27 13:30:05', NULL),
(12, 20, 7, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-28 04:19:49', NULL),
(13, 19, 7, NULL, 'tesktg', 2, 12000.00, 6000.00, '2025-06-28 04:19:49', NULL),
(14, 17, 7, NULL, 'jaket', 2, 20000.00, 10000.00, '2025-06-28 04:19:49', NULL),
(15, 20, 8, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-28 17:38:54', NULL),
(16, 19, 8, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-28 17:38:54', NULL),
(17, 20, 9, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 03:31:37', NULL),
(18, 19, 9, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-29 03:31:37', NULL),
(19, 20, 10, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 03:39:14', NULL),
(20, 19, 10, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-29 03:39:14', NULL),
(21, 18, 10, NULL, 'aqua', 1, 3500.00, 3500.00, '2025-06-29 03:39:14', NULL),
(22, 20, 11, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 03:42:20', NULL),
(23, 19, 11, NULL, 'tesktg', 2, 12000.00, 6000.00, '2025-06-29 03:42:20', NULL),
(24, 18, 11, NULL, 'aqua', 1, 3500.00, 3500.00, '2025-06-29 03:42:20', NULL),
(25, 20, 12, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 03:49:25', NULL),
(26, 19, 12, NULL, 'tesktg', 2, 12000.00, 6000.00, '2025-06-29 03:49:25', NULL),
(27, 18, 12, NULL, 'aqua', 1, 3500.00, 3500.00, '2025-06-29 03:49:25', NULL),
(28, 20, 13, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 04:15:08', NULL),
(29, 19, 13, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-29 04:15:08', NULL),
(30, 20, 14, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 04:16:59', NULL),
(31, 19, 14, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-29 04:16:59', NULL),
(32, 20, 15, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 04:25:46', NULL),
(33, 19, 15, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-29 04:25:46', NULL),
(34, 19, 16, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-29 04:26:26', NULL),
(35, 18, 16, NULL, 'aqua', 1, 3500.00, 3500.00, '2025-06-29 04:26:26', NULL),
(36, 20, 17, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 05:31:21', NULL),
(37, 19, 17, NULL, 'tesktg', 2, 12000.00, 6000.00, '2025-06-29 05:31:21', NULL),
(38, NULL, 18, NULL, 'Manual Input', 1, 9000.00, 9000.00, '2025-06-29 05:33:49', NULL),
(39, 20, 19, NULL, 'tes526', 3, 27000.00, 9000.00, '2025-06-29 05:56:11', NULL),
(40, 19, 19, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-29 05:56:11', NULL),
(41, 3, 20, NULL, 'tesss2', 1, 12000.00, 12000.00, '2025-06-29 06:00:43', NULL),
(42, 4, 20, NULL, 'igjgj', 1, 5000.00, 5000.00, '2025-06-29 06:00:43', NULL),
(43, 3, 21, NULL, 'tesss2', 1, 12000.00, 12000.00, '2025-06-29 06:01:53', NULL),
(44, 7, 21, NULL, 'tessimpanbuat', 1, 9000.00, 9000.00, '2025-06-29 06:01:53', NULL),
(45, 19, 22, NULL, 'tesktg', 2, 12000.00, 6000.00, '2025-06-29 06:05:01', NULL),
(46, 20, 23, NULL, 'tes526', 2, 18000.00, 9000.00, '2025-06-29 06:06:44', NULL),
(47, 20, 24, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-29 13:47:33', NULL),
(48, 19, 24, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-29 13:47:33', NULL),
(49, 20, 25, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-30 09:42:46', NULL),
(50, 19, 25, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-30 09:42:46', NULL),
(51, 20, 26, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-06-30 10:09:50', NULL),
(52, 19, 26, NULL, 'tesktg', 1, 6000.00, 6000.00, '2025-06-30 10:09:50', NULL),
(53, 20, 27, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-07-01 12:26:10', NULL),
(54, 17, 27, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-07-01 12:26:10', NULL),
(55, 17, 28, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-07-01 12:50:48', NULL),
(56, 20, 28, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-07-01 12:50:48', NULL),
(57, 17, 29, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-07-01 12:53:34', NULL),
(58, 17, 30, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-07-01 13:00:25', NULL),
(59, 17, 31, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-07-01 13:10:01', NULL),
(60, 17, 32, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-07-01 13:38:04', NULL),
(61, 17, 33, NULL, 'jaket', 1, 10000.00, 10000.00, '2025-07-01 13:57:48', NULL),
(62, 20, 33, NULL, 'tes526', 1, 9000.00, 9000.00, '2025-07-01 13:57:48', NULL),
(63, NULL, 34, NULL, 'Manual Input', 1, 9000.00, 9000.00, '2025-07-01 16:24:46', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `nota_pembelian`
--

CREATE TABLE `nota_pembelian` (
  `id` int(11) NOT NULL,
  `id_pembelian` int(11) NOT NULL,
  `id_barang` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `harga_beli` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `nota_pembelian`
--

INSERT INTO `nota_pembelian` (`id`, `id_pembelian`, `id_barang`, `jumlah`, `harga_beli`) VALUES
(1, 1, 20, 5, 6000.00),
(2, 2, 17, 5, 3000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembelian`
--

CREATE TABLE `pembelian` (
  `id` int(10) NOT NULL,
  `id_supplier` int(10) DEFAULT NULL,
  `nomor_po` varchar(100) DEFAULT NULL,
  `tanggal_pesanan` date DEFAULT NULL,
  `tanggal_penerima` date DEFAULT NULL,
  `status` varchar(250) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pembelian`
--

INSERT INTO `pembelian` (`id`, `id_supplier`, `nomor_po`, `tanggal_pesanan`, `tanggal_penerima`, `status`, `created_at`) VALUES
(1, 1, '6728', '2025-07-01', '2025-07-01', 'Selesai', '2025-07-01 04:41:50'),
(2, 2, '52728292', '2025-07-01', '2025-07-01', 'Selesai', '2025-07-01 05:23:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `supplier`
--

CREATE TABLE `supplier` (
  `id` int(10) NOT NULL,
  `nama_supplier` varchar(250) DEFAULT NULL,
  `no_telepon` varchar(12) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `supplier`
--

INSERT INTO `supplier` (`id`, `nama_supplier`, `no_telepon`, `created_at`) VALUES
(1, 'Tessuppliier', '2147483647', '2025-07-02 20:09:17'),
(2, 'newbaru', '866953554', '2025-07-01 04:50:34'),
(3, 'brulgi', '081216903372', '2025-07-01 04:51:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(10) NOT NULL,
  `id_kasir` int(10) NOT NULL,
  `total_kuantitas_barang` int(250) DEFAULT NULL,
  `total_transaksi_akhir` decimal(10,2) DEFAULT NULL,
  `metode_pembayaran` varchar(50) DEFAULT NULL,
  `status_transaksi` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi`
--

INSERT INTO `transaksi` (`id`, `id_kasir`, `total_kuantitas_barang`, `total_transaksi_akhir`, `metode_pembayaran`, `status_transaksi`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 19000.00, 'Tunai', 'Selesai', '2025-06-26 17:42:25', NULL),
(2, 1, 1, 10000.00, 'Tunai', 'Selesai', '2025-06-26 17:42:33', NULL),
(3, 1, 1, 9000.00, 'Tunai', 'Selesai', '2025-06-26 17:42:40', NULL),
(4, 1, 3, 32000.00, 'Tunai', 'Selesai', '2025-06-27 01:09:34', NULL),
(5, 1, 2, 12500.00, 'Tunai', 'Selesai', '2025-06-27 01:28:17', NULL),
(6, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-27 13:30:05', NULL),
(7, 1, 5, 41000.00, 'Tunai', 'Selesai', '2025-06-28 04:19:49', NULL),
(8, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-28 17:38:54', NULL),
(9, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-29 03:31:37', NULL),
(10, 1, 3, 18500.00, 'Tunai', 'Selesai', '2025-06-29 03:39:14', NULL),
(11, 1, 4, 24500.00, 'Tunai', 'Selesai', '2025-06-29 03:42:20', NULL),
(12, 1, 4, 24500.00, 'Tunai', 'Selesai', '2025-06-29 03:49:25', NULL),
(13, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-29 04:15:08', NULL),
(14, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-29 04:16:59', NULL),
(15, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-29 04:25:46', NULL),
(16, 1, 2, 9500.00, 'Tunai', 'Selesai', '2025-06-29 04:26:26', NULL),
(17, 1, 3, 21000.00, 'Tunai', 'Selesai', '2025-06-29 05:31:21', NULL),
(18, 1, 1, 9000.00, 'Tunai', 'Selesai', '2025-06-29 05:33:49', NULL),
(19, 1, 4, 33000.00, 'Tunai', 'Selesai', '2025-06-29 05:56:11', NULL),
(20, 1, 2, 17000.00, 'Tunai', 'Selesai', '2025-06-29 06:00:43', NULL),
(21, 1, 2, 21000.00, 'Tunai', 'Selesai', '2025-06-29 06:01:53', NULL),
(22, 1, 2, 12000.00, 'Tunai', 'Selesai', '2025-06-29 06:05:01', NULL),
(23, 1, 2, 18000.00, 'Tunai', 'Selesai', '2025-06-29 06:06:44', NULL),
(24, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-29 13:47:33', NULL),
(25, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-30 09:42:46', NULL),
(26, 1, 2, 15000.00, 'Tunai', 'Selesai', '2025-06-30 10:09:50', NULL),
(27, 1, 2, 19000.00, 'Tunai', 'Selesai', '2025-07-01 12:26:10', NULL),
(28, 1, 2, 19000.00, 'Tunai', 'Selesai', '2025-07-01 12:50:48', NULL),
(29, 1, 1, 10000.00, 'Tunai', 'Selesai', '2025-07-01 12:53:34', NULL),
(30, 1, 1, 10000.00, 'Tunai', 'Selesai', '2025-07-01 13:00:25', NULL),
(31, 1, 1, 10000.00, 'Tunai', 'Selesai', '2025-07-01 13:10:01', NULL),
(32, 1, 1, 10000.00, 'Tunai', 'Selesai', '2025-07-01 13:38:04', NULL),
(33, 1, 2, 19000.00, 'Tunai', 'Selesai', '2025-07-01 13:57:48', NULL),
(34, 1, 1, 9000.00, 'Tunai', 'Selesai', '2025-07-01 16:24:46', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `no_telpon` varchar(20) DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama_lengkap`, `username`, `no_telpon`, `role`, `password`, `created_at`, `updated_at`) VALUES
(1, 'tesass', 'hahw', '8636637383', 'Kasir', '$2y$10$CLapPzUgibeIaZ/C8058xusk3eV9hBqFCkWtO0YTkOxPRiezop6jC', '2025-06-24 15:59:58', NULL),
(2, 'Riski ', 'riskii', '08152388790', 'Kasir', '$2y$10$KgHkyZ5gAE79YbxLxmwIK..EXXuzU5BytjZyX4ZfGIdlxjM1y70l2', '2025-06-24 16:16:36', NULL),
(3, 'Ahmadi', 'ahmad', '6373738876', 'Gudang', '$2y$10$9SAzfjYNLclAWFR9SmaSd.c5D6cYGQcVUsNezbMmd6PFZFzHY6M2i', '2025-06-24 16:39:09', NULL),
(4, 'riski', 'riski', '0181622299', 'Gudang', '$2y$10$6CuT5JNgyXIibCt/eKnRt.uYe..ZAqzqYf10n8WbPRghN8juFNUNq', '2025-06-25 03:24:56', NULL),
(5, 'Safira ', 'cantik ', '088654356', 'Gudang', '$2y$10$e.fIZCxbZKPufj56MLs4devmTkg.E1nG400DaDeQoa8XL8hx54u92', '2025-06-26 01:13:05', NULL),
(6, 'bebaskan', 'ucok', '82829299', 'Kasir', '$2y$10$rmEilFHhPinN5vnEXax4jOkVFEqJOW.Mj4oCxY0PJN1XR9Xy.dtTO', '2025-06-26 14:43:26', NULL),
(7, 'rikooo', 'riko', '09863536', 'Gudang', '$2y$10$Z2KRUZsvt3vUza7MuPpCFu9IcDYmvat3yloqXej0WI4CkqttrkhG2', '2025-07-01 03:51:45', NULL),
(8, 'Kel Tiga Belas', 'kel13', '081637963452', 'Kasir', '$2y$10$x4qEUIh5WWUnTQ.lUl0hkOloUtHspEAwhMw.zhtKO60eNUF0sO4hy', '2025-07-02 18:25:26', NULL),
(9, 'Kel Tiga Belas', 'kel-13', '123456789012', 'Gudang', '$2y$10$C4Fn1/BNtbG5gtydpdVeHOblYPqnZ25bPbFNMaunCh/8Zxe2AZjdO', '2025-07-02 18:28:20', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_barang` (`kode_barang`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indeks untuk tabel `harga_jual`
--
ALTER TABLE `harga_jual`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_barang` (`id_barang`);

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `nota`
--
ALTER TABLE `nota`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_barang` (`id_barang`),
  ADD KEY `id_transaksi` (`id_transaksi`);

--
-- Indeks untuk tabel `nota_pembelian`
--
ALTER TABLE `nota_pembelian`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pembelian` (`id_pembelian`),
  ADD KEY `id_barang` (`id_barang`);

--
-- Indeks untuk tabel `pembelian`
--
ALTER TABLE `pembelian`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kasir` (`id_kasir`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT untuk tabel `harga_jual`
--
ALTER TABLE `harga_jual`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `nota`
--
ALTER TABLE `nota`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT untuk tabel `nota_pembelian`
--
ALTER TABLE `nota_pembelian`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `pembelian`
--
ALTER TABLE `pembelian`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `barang_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `harga_jual`
--
ALTER TABLE `harga_jual`
  ADD CONSTRAINT `harga_jual_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `nota`
--
ALTER TABLE `nota`
  ADD CONSTRAINT `nota_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `nota_ibfk_2` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `nota_pembelian`
--
ALTER TABLE `nota_pembelian`
  ADD CONSTRAINT `nota_pembelian_ibfk_1` FOREIGN KEY (`id_pembelian`) REFERENCES `pembelian` (`id`),
  ADD CONSTRAINT `nota_pembelian_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id`);

--
-- Ketidakleluasaan untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_kasir`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
