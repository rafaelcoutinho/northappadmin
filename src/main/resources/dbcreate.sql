-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `Resultado`;
DROP TABLE IF EXISTS `Trekker_Equipe`;
DROP TABLE IF EXISTS `Inscricao`;
DROP TABLE IF EXISTS `Trekker`;
DROP TABLE IF EXISTS `Grid`;
DROP TABLE IF EXISTS `Equipe`;
DROP TABLE IF EXISTS `Etapa`;
DROP TABLE IF EXISTS `Local`;
DROP TABLE IF EXISTS `Categoria`;
-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Etapa'
-- 
-- ---

DROP TABLE IF EXISTS `Etapa`;
		
CREATE TABLE `Etapa` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Local` INTEGER NULL DEFAULT NULL,
  `titulo` VARCHAR(100) NOT NULL DEFAULT 'NULL',
  `descricao` VARCHAR(256) NULL DEFAULT NULL,
  `data` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Local'
-- 
-- ---

DROP TABLE IF EXISTS `Local`;
		
CREATE TABLE `Local` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `nome` VARCHAR(30) NOT NULL DEFAULT 'NULL',
  `endereco` VARCHAR(256) NULL DEFAULT NULL,
  `latitude` INTEGER NULL DEFAULT NULL,
  `longitude` INTEGER NULL DEFAULT NULL,
  `telefone` VARCHAR(25) NULL DEFAULT NULL,
  `website` VARCHAR(256) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Trekker'
-- 
-- ---

DROP TABLE IF EXISTS `Trekker`;
		
CREATE TABLE `Trekker` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `imagem` VARCHAR(256) NULL DEFAULT NULL,
  `nome` VARCHAR(256) NULL DEFAULT NULL,
  `email` VARCHAR(80) NULL DEFAULT NULL,
  `telefone` VARCHAR(30) NULL DEFAULT NULL,
  `fbid` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Equipe'
-- 
-- ---

DROP TABLE IF EXISTS `Equipe`;
		
CREATE TABLE `Equipe` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `nome` VARCHAR(100) NOT NULL DEFAULT 'NULL',
  `cidade` VARCHAR(80) NULL DEFAULT NULL,
  `id_Categoria` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Inscricao'
-- 
-- ---

DROP TABLE IF EXISTS `Inscricao`;
		
CREATE TABLE `Inscricao` (
  `id_Trekker` INTEGER NULL DEFAULT NULL,
  `id_Etapa` INTEGER NULL DEFAULT NULL,
  `paga` BINARY NULL DEFAULT NULL,
  PRIMARY KEY (`id_Trekker`, `id_Etapa`)
);

-- ---
-- Table 'Trekker_Equipe'
-- 
-- ---

DROP TABLE IF EXISTS `Trekker_Equipe`;
		
CREATE TABLE `Trekker_Equipe` (
  `id_Trekker` INTEGER NULL DEFAULT NULL,
  `id_Equipe` INTEGER NULL DEFAULT NULL,
  `start` DATE NULL DEFAULT NULL,
  `end` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id_Trekker`, `id_Equipe`, `start`)
);

-- ---
-- Table 'Resultado'
-- 
-- ---

DROP TABLE IF EXISTS `Resultado`;
		
CREATE TABLE `Resultado` (
  `id_Equipe` INTEGER NULL DEFAULT NULL,
  `id_Etapa` INTEGER NULL DEFAULT NULL,
  `pontos` INTEGER NULL DEFAULT NULL,
  `id_Categoria` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id_Etapa`, `id_Equipe`)
);

-- ---
-- Table 'Grid'
-- 
-- ---

DROP TABLE IF EXISTS `Grid`;
		
CREATE TABLE `Grid` (
  `id_Equipe` INTEGER NULL DEFAULT NULL,
  `id_Etapa` INTEGER NULL DEFAULT NULL,
  `largada` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id_Equipe`, `id_Etapa`)
);

-- ---
-- Table 'Categoria'
-- 
-- ---

DROP TABLE IF EXISTS `Categoria`;
		
CREATE TABLE `Categoria` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `nome` VARCHAR(40) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `Etapa` ADD FOREIGN KEY (id_Local) REFERENCES `Local` (`id`);
ALTER TABLE `Equipe` ADD FOREIGN KEY (id_Categoria) REFERENCES `Categoria` (`id`);
ALTER TABLE `Inscricao` ADD FOREIGN KEY (id_Trekker) REFERENCES `Trekker` (`id`);
ALTER TABLE `Inscricao` ADD FOREIGN KEY (id_Etapa) REFERENCES `Etapa` (`id`);
ALTER TABLE `Trekker_Equipe` ADD FOREIGN KEY (id_Trekker) REFERENCES `Trekker` (`id`);
ALTER TABLE `Trekker_Equipe` ADD FOREIGN KEY (id_Equipe) REFERENCES `Equipe` (`id`);
ALTER TABLE `Resultado` ADD FOREIGN KEY (id_Equipe) REFERENCES `Equipe` (`id`);
ALTER TABLE `Resultado` ADD FOREIGN KEY (id_Etapa) REFERENCES `Etapa` (`id`);
ALTER TABLE `Resultado` ADD FOREIGN KEY (id_Categoria) REFERENCES `Categoria` (`id`);
ALTER TABLE `Grid` ADD FOREIGN KEY (id_Equipe) REFERENCES `Equipe` (`id`);
ALTER TABLE `Grid` ADD FOREIGN KEY (id_Etapa) REFERENCES `Etapa` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Etapa` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Local` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Trekker` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Equipe` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Inscricao` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Trekker_Equipe` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Resultado` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Grid` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Categoria` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Etapa` (`id`,`id_Local`,`titulo`,`descricao`,`data`) VALUES
-- ('','','','','');
-- INSERT INTO `Local` (`id`,`nome`,`endereco`,`latitude`,`longitude`,`telefone`,`website`) VALUES
-- ('','','','','','','');
-- INSERT INTO `Trekker` (`id`,`imagem`,`nome`,`email`,`telefone`,`fbid`) VALUES
-- ('','','','','','');
-- INSERT INTO `Equipe` (`id`,`nome`,`cidade`,`id_Categoria`) VALUES
-- ('','','','');
-- INSERT INTO `Inscricao` (`id_Trekker`,`id_Etapa`,`paga`) VALUES
-- ('','','');
-- INSERT INTO `Trekker_Equipe` (`id_Trekker`,`id_Equipe`,`start`,`end`) VALUES
-- ('','','','');
-- INSERT INTO `Resultado` (`id_Equipe`,`id_Etapa`,`pontos`,`id_Categoria`) VALUES
-- ('','','','');
-- INSERT INTO `Grid` (`id_Equipe`,`id_Etapa`,`largada`) VALUES
-- ('','','');
-- INSERT INTO `Categoria` (`id`,`nome`) VALUES ('','');
