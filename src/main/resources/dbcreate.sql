use northdb;
-- MySQL dump 10.13  Distrib 5.7.9, for linux-glibc2.5 (x86_64)
--
-- Host: localhost    Database: north
-- ------------------------------------------------------
-- Server version	5.5.47-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Categoria`
--

DROP TABLE IF EXISTS `Categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Categoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Destaque`
--

DROP TABLE IF EXISTS `Destaque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Destaque` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `imgUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Equipe`
--

DROP TABLE IF EXISTS `Equipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Equipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL DEFAULT 'NULL',
  `descricao` varchar(80) DEFAULT NULL,
  `id_Categoria` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_Categoria` (`id_Categoria`),
  CONSTRAINT `Equipe_ibfk_1` FOREIGN KEY (`id_Categoria`) REFERENCES `Categoria` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Etapa`
--

DROP TABLE IF EXISTS `Etapa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Etapa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_Local` int(11) DEFAULT NULL,
  `titulo` varchar(100) NOT NULL DEFAULT 'NULL',
  `descricao` varchar(256) DEFAULT NULL,
  `data` bigint(20) DEFAULT NULL,
  `imgSmall` varchar(256) DEFAULT NULL,
  `imgBig` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_Local` (`id_Local`),
  CONSTRAINT `Etapa_ibfk_1` FOREIGN KEY (`id_Local`) REFERENCES `Local` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Grid`
--

DROP TABLE IF EXISTS `Grid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Grid` (
  `id_Equipe` int(11) NOT NULL DEFAULT '0',
  `id_Etapa` int(11) NOT NULL DEFAULT '0',
  `largada` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_Equipe`,`id_Etapa`),
  KEY `id_Etapa` (`id_Etapa`),
  CONSTRAINT `Grid_ibfk_1` FOREIGN KEY (`id_Equipe`) REFERENCES `Equipe` (`id`),
  CONSTRAINT `Grid_ibfk_2` FOREIGN KEY (`id_Etapa`) REFERENCES `Etapa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Inscricao`
--

DROP TABLE IF EXISTS `Inscricao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Inscricao` (
  `id_Trekker` int(11) NOT NULL DEFAULT '0',
  `id_Etapa` int(11) NOT NULL DEFAULT '0',
  `paga` binary(1) DEFAULT NULL,
  PRIMARY KEY (`id_Trekker`,`id_Etapa`),
  KEY `id_Etapa` (`id_Etapa`),
  CONSTRAINT `Inscricao_ibfk_1` FOREIGN KEY (`id_Trekker`) REFERENCES `Trekker` (`id`),
  CONSTRAINT `Inscricao_ibfk_2` FOREIGN KEY (`id_Etapa`) REFERENCES `Etapa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Local`
--

DROP TABLE IF EXISTS `Local`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Local` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(30) NOT NULL DEFAULT 'NULL',
  `endereco` varchar(256) DEFAULT NULL,
  `latitude` int(11) DEFAULT NULL,
  `longitude` int(11) DEFAULT NULL,
  `telefone` varchar(25) DEFAULT NULL,
  `website` varchar(256) DEFAULT NULL,
  `descricao` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Resultado`
--

DROP TABLE IF EXISTS `Resultado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Resultado` (
  `id_Equipe` int(11) NOT NULL DEFAULT '0',
  `id_Etapa` int(11) NOT NULL DEFAULT '0',
  `pontos` int(11) DEFAULT NULL,
  `id_Categoria` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_Etapa`,`id_Equipe`),
  KEY `id_Equipe` (`id_Equipe`),
  KEY `id_Categoria` (`id_Categoria`),
  CONSTRAINT `Resultado_ibfk_1` FOREIGN KEY (`id_Equipe`) REFERENCES `Equipe` (`id`),
  CONSTRAINT `Resultado_ibfk_2` FOREIGN KEY (`id_Etapa`) REFERENCES `Etapa` (`id`),
  CONSTRAINT `Resultado_ibfk_3` FOREIGN KEY (`id_Categoria`) REFERENCES `Categoria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Trekker`
--

DROP TABLE IF EXISTS `Trekker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Trekker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imagem` varchar(256) DEFAULT NULL,
  `nome` varchar(256) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `fbid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Trekker_Equipe`
--

DROP TABLE IF EXISTS `Trekker_Equipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Trekker_Equipe` (
  `id_Trekker` int(11) NOT NULL DEFAULT '0',
  `id_Equipe` int(11) NOT NULL DEFAULT '0',
  `start` date NOT NULL DEFAULT '0000-00-00',
  `end` date DEFAULT NULL,
  PRIMARY KEY (`id_Trekker`,`id_Equipe`,`start`),
  KEY `id_Equipe` (`id_Equipe`),
  CONSTRAINT `Trekker_Equipe_ibfk_1` FOREIGN KEY (`id_Trekker`) REFERENCES `Trekker` (`id`),
  CONSTRAINT `Trekker_Equipe_ibfk_2` FOREIGN KEY (`id_Equipe`) REFERENCES `Equipe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-29 11:31:15
