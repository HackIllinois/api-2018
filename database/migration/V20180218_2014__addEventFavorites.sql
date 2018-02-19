CREATE TABLE `event_favorites` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`user_id` INT UNSIGNED NOT NULL,
	`event_id` INT UNSIGNED NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_event_favorites_user_id_idx` (`user_id` ASC),
	INDEX `fk_event_favorites_event_id_idx` (`event_id` ASC),
	CONSTRAINT `event_favorite_UNIQUE` UNIQUE (`user_id`, `event_id`),
	CONSTRAINT `fk_event_favorites_user_id`
		FOREIGN KEY (`user_id`)
		REFERENCES `users` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_event_favorites_event_id`
		FOREIGN KEY (`event_id`)
		REFERENCES `events` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);
