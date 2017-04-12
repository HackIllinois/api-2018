CREATE TABLE `locations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `longitude` DOUBLE NOT NULL,
  `latitude` DOUBLE NOT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `events` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `name` VARCHAR(255) NOT NULL,
   `description` VARCHAR(2047) NOT NULL,
   `start_time` DATETIME NOT NULL,
   `end_time` DATETIME NOT NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `event_locations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` INT UNSIGNED NOT NULL,
  `location_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_event_locations_event_id_idx` (`event_id` ASC),
  INDEX `fk_event_locations_location_id_idx` (`location_id` ASC),
  CONSTRAINT `fk_event_locations_event_id_idx`
		FOREIGN KEY (`event_id`)
		REFERENCES `events` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
  CONSTRAINT `fk_event_locations_location_id_idx`
		FOREIGN KEY (`location_id`)
		REFERENCES `locations` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);
