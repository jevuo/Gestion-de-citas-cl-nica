

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

DROP SCHEMA IF EXISTS clinica;

-- -----------------------------------------------------
-- 
-- -----------------------------------------------------
CREATE SCHEMA clinica DEFAULT CHARACTER SET utf8;
USE clinica;

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE IF NOT EXISTS `pacientes` (
  `dni` varchar(9)  NOT NULL,
  `apellidosNombre` varchar(50) NOT NULL,
  `telefono` varchar(9)  NOT NULL,
  PRIMARY KEY (`dni`)
) ENGINE=InnoDB DEFAULT CHARACTER SET latin1 COLLATE latin1_spanish_ci;




-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE IF NOT EXISTS `medicos` (
  `idMedico` smallint(5) unsigned NOT NULL,
  `apellidosNombre` varchar(50) NOT NULL,
  `especialidad` smallint(5) unsigned NOT NULL,
  `tramoInicial` varchar(5) NOT NULL,
  `tramoFinal` varchar(5) NOT NULL,

   PRIMARY KEY (`idMedico`)
)ENGINE=InnoDB DEFAULT CHARACTER SET latin1 COLLATE latin1_spanish_ci;



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidad`
--

CREATE TABLE IF NOT EXISTS `especialidades` (
  `idEspecialidad` smallint(5) unsigned NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  PRIMARY KEY (`idEspecialidad`)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET latin1 COLLATE latin1_spanish_ci;


--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE IF NOT EXISTS `citas` (
 `idCitas` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
 `dni` varchar(9) NOT NULL,
 `idEspecialidad` smallint(5) NOT NULL,
 `idMedico` smallint(5) NOT NULL,
 `fecha` date NOT NULL,
 `hora` time NOT NULL,
  PRIMARY KEY (`idCitas`)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET latin1 COLLATE latin1_spanish_ci;

-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`dni`, `apellidosNombre`, `telefono`) VALUES
("11111111A", "Pimentel Fernandez, Ines", "611111111"),
("22222222B", "Lopez Perez, Pedro", "622222222"),
("33333333C", "Sanchez Cano,Inmaculada" , "633333333"),
("44444444D", "Martos Jimenez, Laura", "644444444"),
("55555555E", "Redondo Martinez", "655555555"),
("66666666F", "Espinosa Canterero, Manuel", "666666666");

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`idMedico`, `apellidosNombre`, especialidad, `tramoInicial`, `tramoFinal`) VALUES
(1, "Pimentel Fernandez, Candela",3, "10:00", "12:00"),
(2, "Alvarez Castillo, Ana", 5, "09:00", "11:00"),
(3, "Cano Pedroche, Silvia", 2, "17:00", "19:00"),
(4, "Gomez Rodriguez, Roberto",1, "12:00", "15:00"),
(5, "Zarrias Benavente, Julio", 3, "17:00", "20:00"),
(6, "Gonzalez Barrios, Javier", 4, "09:00", "11:00"),
(7, "Perea Manzano, Alberto", 2, "17:00", "19:00"),
(8, "Garrido Contreras, M. Sol", 3, "12:00", "15:00"),
(9, "Zambrano Leal, Benito", 5, "10:00", "12:00"),
(10, "Pimentel Sanchez, Laura", 1, "17:00", "19:00");

 
INSERT INTO `especialidades` (`idEspecialidad`, `descripcion`) VALUES
(1, "Cardiologia"),
(2, "Neurologia"),
(3, "Digestivo"),
(4, "Pediatria"),
(5, "Traumatologia");


