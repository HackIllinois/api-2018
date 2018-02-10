CREATE TABLE `attendees` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) BINARY NOT NULL,
  `shirt_size` ENUM('S', 'M', 'L', 'XL') NOT NULL,
  `diet` ENUM('NONE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE') NOT NULL DEFAULT 'NONE',
  `age` TINYINT UNSIGNED NOT NULL,
  `graduation_year` SMALLINT UNSIGNED NOT NULL,
  `transportation` ENUM('NOT_NEEDED', 'BUS_REQUESTED', 'IN_STATE', 'OUT_OF_STATE', 'INTERNATIONAL') NOT NULL DEFAULT 'NOT_NEEDED',
  `school` VARCHAR(255) NOT NULL,
  `major` VARCHAR(255) NOT NULL,
  `gender` ENUM('MALE', 'FEMALE', 'NON_BINARY', 'OTHER') NOT NULL,
  `professional_interest` ENUM('NONE', 'INTERNSHIP', 'FULLTIME', 'BOTH') NOT NULL DEFAULT 'NONE',
  `github` VARCHAR(50) NOT NULL,
  `linkedin` VARCHAR(50) NOT NULL,
  `interests` VARCHAR(255) NULL DEFAULT NULL,
  `status` ENUM('ACCEPTED', 'WAITLISTED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING',
  `is_novice` TINYINT(1) NOT NULL DEFAULT 0,
  `is_private` TINYINT(1) NOT NULL DEFAULT 0,
  `has_lightning_interest` TINYINT(1) NULL DEFAULT 0,
  `phone_number` VARCHAR(15) NULL DEFAULT NULL,
  `priority` TINYINT(1) UNSIGNED NULL DEFAULT 0,
  `wave` TINYINT(1) UNSIGNED NULL DEFAULT 0,
  `reviewer` VARCHAR(255) NULL DEFAULT NULL,
  `review_time` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_attendees_user_id_idx` (`user_id` ASC),
  CONSTRAINT `fk_attendees_user_id`
	FOREIGN KEY (`user_id`)
	REFERENCES `users` (`id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);

CREATE TABLE `attendee_requested_collaborators` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`attendee_id` INT UNSIGNED NOT NULL,
	`collaborator` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_attendee_requested_collaborators_attendee_id_idx` (`attendee_id` ASC),
	CONSTRAINT `fk_attendee_requested_collaborators_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

CREATE TABLE `attendee_long_form` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`attendee_id` INT UNSIGNED NOT NULL,
	`info` VARCHAR(16383) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_attendee_long_form_attendee_id_idx` (`attendee_id` ASC),
	CONSTRAINT `fk_attendee_long_form_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

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

CREATE TABLE `attendee_extra_infos` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`attendee_id` INT UNSIGNED NOT NULL,
	`info` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_attendee_extra_infos_attendee_id_idx` (`attendee_id` ASC),
	CONSTRAINT `fk_attendee_extra_infos_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

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

INSERT INTO `mailing_lists` (`name`) VALUES ('lightning_talks');

INSERT INTO `mailing_lists` (`name`) VALUES ('wave_1');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_2');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_3');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_4');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_5');
INSERT INTO `mailing_lists` (`name`) VALUES ('rejected');
