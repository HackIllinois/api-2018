ALTER TABLE `attendees`
DROP FOREIGN KEY `fk_attendees_ecosystem_id`;

ALTER TABLE `attendees`
DROP COLUMN `acceptance_type`,
DROP COLUMN `accepted_ecosystem_id`,
DROP COLUMN `review_time`,
DROP COLUMN `reviewer`,
DROP COLUMN `wave`,
DROP COLUMN `priority`,
DROP INDEX `fk_attendees_ecosystem_id_idx` ;

DELETE FROM `mailing_lists` WHERE `name`='wave_1';
DELETE FROM `mailing_lists` WHERE `name`='wave_2';
DELETE FROM `mailing_lists` WHERE `name`='wave_3';
DELETE FROM `mailing_lists` WHERE `name`='wave_4';
DELETE FROM `mailing_lists` WHERE `name`='wave_5';
DELETE FROM `mailing_lists` WHERE `name`='rejected';
