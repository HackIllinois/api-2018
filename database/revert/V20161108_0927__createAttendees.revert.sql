DROP TABLE `attendee_project_interests`;
DROP TABLE `attendee_projects`;
DROP TABLE `attendee_rsvps`;
DROP TABLE `attendee_extra_infos`;
DROP TABLE `attendee_long_form`;
DROP TABLE `attendee_os_contributor`;
DROP TABLE `attendee_ecosystem_interests`;
DROP TABLE `attendee_requested_collaborators`;

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

ALTER TABLE `attendees`
DROP COLUMN `has_lightning_interest`;

DELETE FROM `mailing_lists` WHERE `name`='lightning_talks';


DROP TABLE `attendees`;
