-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: mariadb:3306
-- Tiempo de generación: 09-12-2025 a las 17:30:38
-- Versión del servidor: 12.0.2-MariaDB-ubu2404
-- Versión de PHP: 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `challengefit`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `participaciones`
--

CREATE TABLE `participaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` varchar(20) NOT NULL,
  `reto_id` int(11) NOT NULL,
  `estado` enum('pendiente','completado') DEFAULT 'pendiente',
  `fecha_union` timestamp NULL DEFAULT current_timestamp(),
  `fecha_completado` timestamp NULL DEFAULT NULL,
  `puntos_obtenidos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `participaciones`
--

INSERT INTO `participaciones` (`id`, `usuario_id`, `reto_id`, `estado`, `fecha_union`, `fecha_completado`, `puntos_obtenidos`) VALUES
(1, '101010101', 1, 'completado', '2025-11-28 02:57:06', '2025-11-28 02:57:06', 5),
(2, '101010101', 2, 'completado', '2025-11-28 02:57:06', '2025-11-28 02:57:06', 10),
(3, '202020202', 3, 'completado', '2025-11-28 02:57:06', '2025-12-09 16:23:05', 20),
(4, '303030303', 4, 'completado', '2025-11-28 02:57:06', '2025-11-28 02:57:06', 40),
(5, '303030303', 1, 'completado', '2025-11-28 02:57:06', '2025-12-09 16:24:43', 5);

--
-- Disparadores `participaciones`
--
DELIMITER $$
CREATE TRIGGER `trg_participacion_after` AFTER UPDATE ON `participaciones` FOR EACH ROW BEGIN
    IF OLD.estado = 'pendiente' AND NEW.estado = 'completado' THEN
        -- Sumar puntos y retos cumplidos en ranking_detalle (ejemplo: ranking_global con id=1)
        UPDATE ranking_detalle
        SET puntos_totales = puntos_totales + (
                SELECT puntos FROM retos WHERE id = NEW.reto_id
            ),
            retos_cumplidos = retos_cumplidos + 1
        WHERE usuario_id = NEW.usuario_id
          AND ranking_id = 1;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_participacion_before` BEFORE UPDATE ON `participaciones` FOR EACH ROW BEGIN
    IF OLD.estado = 'pendiente' AND NEW.estado = 'completado' THEN
        -- Asignar puntos del reto directamente
        SET NEW.puntos_obtenidos = (
            SELECT puntos FROM retos WHERE id = NEW.reto_id
        );
        -- Registrar fecha de completado
        SET NEW.fecha_completado = NOW();
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ranking`
--

CREATE TABLE `ranking` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_creado` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `ranking`
--

INSERT INTO `ranking` (`id`, `nombre`, `descripcion`, `fecha_creado`) VALUES
(1, 'ranking_global', 'Primer ranking global generado automáticamente', '2025-11-28 02:57:06'),
(2, 'ranking_enero', 'Ranking del mes de enero', '2025-11-28 02:57:06'),
(3, 'ejm', '1234', '2025-11-28 05:06:57'),
(4, 'ejm', 'ejm', '2025-11-29 05:12:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ranking_detalle`
--

CREATE TABLE `ranking_detalle` (
  `id` int(11) NOT NULL,
  `ranking_id` int(11) NOT NULL,
  `usuario_id` varchar(20) NOT NULL,
  `puntos_totales` int(11) NOT NULL,
  `retos_cumplidos` int(11) NOT NULL,
  `fecha_generado` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `ranking_detalle`
--

INSERT INTO `ranking_detalle` (`id`, `ranking_id`, `usuario_id`, `puntos_totales`, `retos_cumplidos`, `fecha_generado`) VALUES
(1, 1, '101010101', 15, 2, '2025-11-28 02:57:06'),
(2, 1, '303030303', 45, 2, '2025-11-28 02:57:06'),
(3, 2, '101010101', 15, 2, '2025-11-28 02:57:06'),
(4, 2, '202020202', 0, 0, '2025-11-28 02:57:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `retos`
--

CREATE TABLE `retos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `nivel` enum('bostezo','principiante','intermedio','toro','chris_bumsted') NOT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `retos`
--

INSERT INTO `retos` (`id`, `nombre`, `descripcion`, `nivel`, `puntos`) VALUES
(1, 'Reto de estiramientos', 'Estirar 5 minutos al despertar', 'bostezo', 5),
(2, 'Reto básico de cardio', 'Caminar 10 minutos', 'principiante', 10),
(3, 'Reto intermedio de piernas', '10 sentadillas + 10 zancadas', 'intermedio', 20),
(4, 'Reto toro de fuerza', '5 dominadas + 20 flexiones', 'toro', 40),
(5, 'Reto chris_bumsted', 'Entrenamiento completo de culturista', 'chris_bumsted', 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(200) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `edad` int(11) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `contrasena`, `role`, `edad`, `peso`, `altura`) VALUES
('101010101', 'Erik', 'erik@example.com', '$2b$10$X2n72QIs2IYNkyI382aRrOcVgfvd.U8C6lXk7vEw74Niy3hvCaTF.', 'admin', 19, 75.50, 1.80),
('110210498', 'Carlos', 'carlos@example.com', '$2b$10$UaIcUK.YnSz9leYXwllzcOLoKgpYcaeUQuWVaSCTm8XPzjoqbIfqK', 'user', 25, 70.50, 1.75),
('202020202', 'Matias', 'matias@example.com', '$2b$10$X2n72QIs2IYNkyI382aRrOcVgfvd.U8C6lXk7vEw74Niy3hvCaTF.', 'user', 20, 82.00, 1.78),
('303030303', 'Laura', 'laura@example.com', '$2b$10$X2n72QIs2IYNkyI382aRrOcVgfvd.U8C6lXk7vEw74Niy3hvCaTF.', 'user', 22, 60.20, 1.65),
('34444', 'Cs', 'cs@example.com', '$2b$10$FF3xChQ2qSCZojYhG2EIjOB4DRXh5NYXJ95/DJx9TcF8pmrg4zu8G', 'user', 25, 70.50, 1.75),
('9090909090', 'Prueba', 'prueba@example.com', '$2b$10$X2n72QIs2IYNkyI382aRrOcVgfvd.U8C6lXk7vEw74Niy3hvCaTF.', 'admin', 19, 75.50, 1.80);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `participaciones`
--
ALTER TABLE `participaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `reto_id` (`reto_id`);

--
-- Indices de la tabla `ranking`
--
ALTER TABLE `ranking`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ranking_detalle`
--
ALTER TABLE `ranking_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ranking_id` (`ranking_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `retos`
--
ALTER TABLE `retos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `participaciones`
--
ALTER TABLE `participaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ranking`
--
ALTER TABLE `ranking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ranking_detalle`
--
ALTER TABLE `ranking_detalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `retos`
--
ALTER TABLE `retos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `participaciones`
--
ALTER TABLE `participaciones`
  ADD CONSTRAINT `participaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participaciones_ibfk_2` FOREIGN KEY (`reto_id`) REFERENCES `retos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ranking_detalle`
--
ALTER TABLE `ranking_detalle`
  ADD CONSTRAINT `ranking_detalle_ibfk_1` FOREIGN KEY (`ranking_id`) REFERENCES `ranking` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ranking_detalle_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
