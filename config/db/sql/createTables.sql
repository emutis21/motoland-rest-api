-- CREATE DATABASE supermarket_db;
-- DROP DATABASE motosdb;

CREATE DATABASE IF NOT EXISTS motosdb;
USE motosdb;

CREATE TABLE `moto` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `model` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `brand` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `new` BOOLEAN NOT NULL,
  `year` INT NOT NULL,
  `velMax` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `color` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `moto_color` (
  `moto_id` INT NOT NULL,
  `color_id` INT NOT NULL,
  FOREIGN KEY (`moto_id`) REFERENCES `moto`(`id`),
  FOREIGN KEY (`color_id`) REFERENCES `color`(`id`)
);

INSERT INTO `moto` (`img`, `model`, `description`, `city`, `brand`, `price`, `new`, `year`, `velMax`) VALUES
('img1.jpg', 'Model1', 'Description1', 'City1', 'Brand1', 10000.00, true, 2020, 200);

INSERT INTO `color` (`name`) VALUES
('Red'),
('Blue');

INSERT INTO `moto_color` (`moto_id`, `color_id`) VALUES
(1, 1),
(1, 2);

-- Insertar 10 motos
INSERT INTO `moto` (`img`, `model`, `description`, `city`, `brand`, `price`, `new`, `year`, `velMax`) VALUES
('img2.jpg', 'Model2', 'Description2', 'City2', 'Brand2', 20000.00, true, 2021, 210),
('img3.jpg', 'Model3', 'Description3', 'City3', 'Brand3', 30000.00, false, 2019, 220),
('img4.jpg', 'Model4', 'Description4', 'City4', 'Brand4', 40000.00, true, 2022, 230),
('img5.jpg', 'Model5', 'Description5', 'City5', 'Brand5', 50000.00, false, 2018, 240),
('img6.jpg', 'Model6', 'Description6', 'City6', 'Brand6', 60000.00, true, 2023, 250),
('img7.jpg', 'Model7', 'Description7', 'City7', 'Brand7', 70000.00, false, 2017, 260),
('img8.jpg', 'Model8', 'Description8', 'City8', 'Brand8', 80000.00, true, 2024, 270),
('img9.jpg', 'Model9', 'Description9', 'City9', 'Brand9', 90000.00, false, 2016, 280),
('img10.jpg', 'Model10', 'Description10', 'City10', 'Brand10', 100000.00, true, 2025, 290),
('img11.jpg', 'Model11', 'Description11', 'City11', 'Brand11', 110000.00, false, 2015, 300);

-- Insertar más colores
INSERT INTO `color` (`name`) VALUES
('Green'),
('Yellow'),
('Black'),
('White'),
('Multicolor');

-- Asignar colores aleatorios a las motos
INSERT INTO `moto_color` (`moto_id`, `color_id`) VALUES
(2, 1), (2, 2), (2, 5), -- Moto 2 con colores Red, Blue, Multicolor
(3, 2), (3, 3), -- Moto 3 con colores Blue, Green
(4, 3), (4, 4), (4, 5), -- Moto 4 con colores Green, Yellow, Multicolor
(5, 4), -- Moto 5 con color Yellow
(6, 1), (6, 4), -- Moto 6 con colores Red, Yellow
(7, 2), (7, 5), -- Moto 7 con colores Blue, Multicolor
(8, 3), -- Moto 8 con color Green
(9, 1), (9, 2), (9, 3), (9, 4), -- Moto 9 con colores Red, Blue, Green, Yellow
(10, 5), -- Moto 10 con color Multicolor
(11, 1), (11, 2), (11, 3), (11, 4), (11, 5); -- Moto 11 con todos los colores

SELECT 
  moto.id, 
  moto.img, 
  moto.model, 
  moto.description, 
  moto.city, 
  moto.brand, 
  moto.price, 
  moto.new, 
  moto.year, 
  moto.velMax, 
  GROUP_CONCAT(DISTINCT color.name) AS colors
FROM 
  moto
LEFT JOIN 
  moto_color ON moto.id = moto_color.moto_id
LEFT JOIN 
  color ON moto_color.color_id = color.id
GROUP BY 
  moto.id;
  
SELECT * FROM moto_color;
