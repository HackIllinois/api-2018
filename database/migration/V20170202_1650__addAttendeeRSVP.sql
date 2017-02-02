CREATE TABLE `attendee_rsvps` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `attendee_id` INT UNSIGNED NOT NULL,
    `is_attending` TINYINT(1) NOT NULL,
    `type` ENUM('CREATE', 'CONTRIBUTE'),
    PRIMARY KEY (`id`),
    INDEX `fk_attendee_rsvps_attendee_id_idx` (`attendee_id` ASC),
CONSTRAINT `fk_attendee_rsvps_attendee_id`
FOREIGN KEY (`attendee_id`)
REFERENCES `attendees` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

INSERT INTO `mailing_lists` (`name`) VALUES ('attendees');
DELETE FROM `mailing_lists` WHERE `name`='software';
DELETE FROM `mailing_lists` WHERE `name`='hardware';
DELETE FROM `mailing_lists` WHERE `name`='open_source';