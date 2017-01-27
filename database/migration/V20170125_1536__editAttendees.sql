ALTER TABLE `attendees` 
ADD COLUMN `priority` TINYINT(1) NOT NULL DEFAULT 0;

ALTER TABLE `attendees`
ADD COLUMN `wave` TINYINT(1) NOT NULL DEFAULT 0;

ALTER TABLE `attendees`
ADD COLUMN `reviewer` VARCHAR(50) NULL;

ALTER TABLE `attendees`
ADD COLUMN `review_time` INT UNSIGNED NULL;

ALTER TABLE `attendees`
ADD COLUMN `accepted_ecosystem_id` INT UNSIGNED NULL;

ALTER TABLE `attendees` 
ADD COLUMN `acceptance_type` ENUM('create', 'contribute') NULL;

INSERT INTO `mailing_lists` (`name`) VALUES ('wave_1');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_2');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_3');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_4');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_5');
INSERT INTO `mailing_lists` (`name`) VALUES ('rejected');