CREATE TABLE `attendee_websites` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`attendee_id` INT UNSIGNED NOT NULL,
	`website` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_attendee_websites_attendee_id_idx` (`attendee_id` ASC),
	CONSTRAINT `fk_attendee_websites_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);
