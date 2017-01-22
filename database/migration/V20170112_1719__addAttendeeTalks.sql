ALTER TABLE `attendees`
ADD COLUMN `has_lightning_interest` TINYINT(1) NULL DEFAULT 0 AFTER `is_private`;

INSERT INTO `mailing_lists` (`name`) VALUES ('lightning_talks');
