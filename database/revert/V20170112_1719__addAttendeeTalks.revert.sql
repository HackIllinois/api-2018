ALTER TABLE `attendees`
DROP COLUMN `has_lightning_interest`;

DELETE FROM `mailing_lists` WHERE `name`='lightning_talks';
