CREATE TABLE `event_favorites` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`attendee_id` INT UNSIGNED NOT NULL,
	`event_id` INT UNSIGNED NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_event_favorites_attendee_id_idx` (`attendee_id` ASC),
	INDEX `fk_event_favorites_event_id_idx` (`event_id` ASC),
	CONSTRAINT `fk_event_favorites_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`user_id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_event_favorites_event_id`
		FOREIGN KEY (`event_id`)
		REFERENCES `events` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);
