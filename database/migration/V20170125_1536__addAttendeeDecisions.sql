ALTER TABLE `attendees`
ADD COLUMN `priority` TINYINT(1) UNSIGNED NULL DEFAULT 0 AFTER `phone_number`,
ADD COLUMN `wave` TINYINT(1) UNSIGNED NULL DEFAULT 0 AFTER `priority`,
ADD COLUMN `reviewer` VARCHAR(255) NULL DEFAULT NULL AFTER `wave`,
ADD COLUMN `review_time` TIMESTAMP NULL DEFAULT NULL AFTER `reviewer`,
ADD COLUMN `accepted_ecosystem_id` INT(10) UNSIGNED NULL DEFAULT NULL AFTER `review_time`,
ADD COLUMN `acceptance_type` ENUM('CREATE', 'CONTRIBUTE') NULL DEFAULT NULL AFTER `accepted_ecosystem_id`,
ADD INDEX `fk_attendees_ecosystem_id_idx` (`accepted_ecosystem_id` ASC);
ALTER TABLE `attendees`
ADD CONSTRAINT `fk_attendees_ecosystem_id`
  FOREIGN KEY (`accepted_ecosystem_id`)
  REFERENCES `ecosystems` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

INSERT INTO `mailing_lists` (`name`) VALUES ('wave_1');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_2');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_3');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_4');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_5');
INSERT INTO `mailing_lists` (`name`) VALUES ('rejected');
