-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2023 at 11:31 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `estore`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `uid` int(11) NOT NULL COMMENT 'identificador do usuario',
  `pid` int(11) NOT NULL COMMENT 'Identificador do produto',
  `data_adicao` date NOT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `quantidade`, `uid`, `pid`, `data_adicao`, `data`) VALUES
(13220699, 1, 11835387, 12157188, '2023-05-31', '2023-05-31 10:22:53'),
(13279414, 1, 11835387, 12985130, '2023-05-31', '2023-05-31 10:22:53'),
(13770355, 1, 11703795, 12663671, '2023-06-02', '2023-06-02 04:58:57'),
(13916295, 1, 11703795, 12985130, '2023-06-02', '2023-06-02 08:43:17');

-- --------------------------------------------------------

--
-- Table structure for table `pedido`
--

CREATE TABLE `pedido` (
  `id` int(11) NOT NULL COMMENT 'Identificador do produto',
  `uid` int(11) NOT NULL COMMENT 'Identificador do usario',
  `preco` double NOT NULL COMMENT 'Soma do valor de todos os produtos',
  `estado` enum('Aberto','Verificado','Pago','Cancelado') NOT NULL COMMENT 'Estado do pedido, podendo assumir os seguentes valores, aberto, pago e cancelado',
  `produtos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Uma lista dos produtos a serem adicionados no carinho' CHECK (json_valid(`produtos`)),
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pedido`
--

INSERT INTO `pedido` (`id`, `uid`, `preco`, `estado`, `produtos`, `data`) VALUES
(14399841, 11703795, 475770.11, 'Verificado', '[{\"pid\":\"12157188\",\"quantidade\":\"3\",\"preco\":\"104997\"},{\"pid\":\"12985130\",\"quantidade\":\"5\",\"preco\":\"200000\"},{\"pid\":\"12663671\",\"quantidade\":\"3\",\"preco\":\"170773.11000000002\"}]', '2023-06-02 21:17:42'),
(14973857, 11703795, 40000, 'Cancelado', '[{\"pid\":\"12985130\",\"quantidade\":\"1\",\"preco\":\"40000\"}]', '2023-06-01 21:19:33');

-- --------------------------------------------------------

--
-- Table structure for table `produto`
--

CREATE TABLE `produto` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `marca` varchar(150) NOT NULL,
  `modelo` varchar(150) NOT NULL,
  `imagem` varchar(200) NOT NULL,
  `preco` double NOT NULL,
  `quantidade` int(11) NOT NULL,
  `descricao` varchar(600) NOT NULL,
  `especificacoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `data_adicao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `categoria` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produto`
--

INSERT INTO `produto` (`id`, `nome`, `marca`, `modelo`, `imagem`, `preco`, `quantidade`, `descricao`, `especificacoes`, `data_adicao`, `categoria`) VALUES
(12157188, 'Canon EOS 6D', 'Canon', 'EOS 6D', 'default', 34999, 15, 'A Canon EOS 6D é uma câmera DSLR de formato full-frame, projetada para fotógrafos entusiastas e profissionais em busca de alta qualidade a um preço acessível. ', 'Sensor de imagem: Sensor CMOS full-frame de 20.2 megapixels., \r\nProcessador de imagem: DIGIC 5+, \r\nSistema de autofoco: 11 pontos de autofoco incluindo um ponto central de tipo cruzado., \r\nDimensões: Aproximadamente 144.5 x 110.5 x 71.2 mm.', '2023-06-01 08:47:12', 'camera'),
(12663671, 'ASUS ZenBook 14 OLED', 'Asus', 'UM3402YA-WS51T', 'default', 56924.37, 10, 'O ASUS ZenBook 14 OLED é um laptop elegante e poderoso projetado para oferecer uma experiência de computação premium. Com um design fino e leve.', 'Gráficos: AMD Radeon Graphics integrado, \r\nCâmera: Câmera HD infravermelho (IR) com suporte para Windows Hello, \r\nÁudio: Alto-falantes estéreo Harman Kardon, compatível com a tecnologia de áudio ASUS SonicMaster', '2023-06-01 10:15:05', 'notbook'),
(12985130, 'Dell XPS 13', 'Dell', 'Xps 13', 'default', 40000, 20, 'O Dell XPS 13 é um laptop elegante e poderoso, projetado para oferecer uma experiência excepcional. Com sua tela InfinityEdge de 13,3 polegadas e resolução Full HD ou Ultra HD.', 'Processador: 10ª geração do Intel Core i3/i5/i7/i9, \r\nMemória Ram: 8 GB/16 GB ou 32 GB LPDDR4x, \r\nArmazenamento: SSD PCIe de 256 GB, 512 GB, 1 TB ou 2 TB', '2023-05-26 22:00:00', 'notbook');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uid` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `type` enum('admin','user') NOT NULL DEFAULT 'user',
  `imagem` varchar(500) NOT NULL DEFAULT 'default',
  `data_adicao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uid`, `name`, `email`, `password`, `type`, `imagem`, `data_adicao`) VALUES
(11703795, 'Erlenio', 'erlenio@gmail.com', 'Simbine01', 'admin', 'default', '2023-05-31 10:23:37'),
(11835387, 'Ecleise Simbine', 'ekysimbine@gmail.com', 'Ecleise', 'user', 'default', '2023-05-31 10:23:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13983728;

--
-- AUTO_INCREMENT for table `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador do produto', AUTO_INCREMENT=14973858;

--
-- AUTO_INCREMENT for table `produto`
--
ALTER TABLE `produto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12985131;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11835388;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
