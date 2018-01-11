CREATE TABLE `attendee_os_contributor` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`attendee_id` INT UNSIGNED NOT NULL,
	`os_contributor` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_attendee_os_contributor_attendee_id_idx` (`attendee_id` ASC),
	CONSTRAINT `fk_attendee_os_contributor_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);
