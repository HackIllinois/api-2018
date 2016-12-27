CREATE TABLE `attendee_ecosystem_interests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attendee_id` INT UNSIGNED NOT NULL,
  `ecosystem_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_attendee_ecosystem_interests_attendee_id_idx` (`attendee_id` ASC),
  INDEX `fk_attendee_ecosystem_interests_ecosystem_id_idx` (`ecosystem_id` ASC),
  CONSTRAINT `fk_attendee_ecosystem_interests_attendee_id_idx`
        FOREIGN KEY (`attendee_id`)
        REFERENCES `hackillinois-2017`.`attendees` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
  CONSTRAINT `fk_attendee_ecosystem_interests_ecosystem_id_idx`
        FOREIGN KEY (`ecosystem_id`)
        REFERENCES `hackillinois-2017`.`ecosystems` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);