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
  `interests` VARCHAR(255) NOT NULL,
  `status` ENUM('ACCEPTED', 'WAITLISTED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING',
  `is_novice` TINYINT(1) NOT NULL DEFAULT 0,
  `is_private` TINYINT(1) NOT NULL DEFAULT 0,
  `phone_number` VARCHAR(15) NULL,
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
	`info` VARCHAR(1023) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_attendee_long_form_attendee_id_idx` (`attendee_id` ASC),
	CONSTRAINT `fk_attendee_long_form_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

CREATE TABLE `attendee_projects` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`attendee_id` INT UNSIGNED NOT NULL,
	`name` VARCHAR(100) NOT NULL,
	`description` VARCHAR(255) NOT NULL,
	`repo` VARCHAR(150) NOT NULL,
	`is_suggestion` TINYINT(1) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_attendee_projects_attendee_id_idx` (`attendee_id` ASC),
	CONSTRAINT `fk_attendee_projects_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

CREATE TABLE `attendee_ecosystem_interests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attendee_id` INT UNSIGNED NOT NULL,
  `ecosystem_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_attendee_ecosystem_interests_attendee_id_idx` (`attendee_id` ASC),
  INDEX `fk_attendee_ecosystem_interests_ecosystem_id_idx` (`ecosystem_id` ASC),
  CONSTRAINT `fk_attendee_ecosystem_interests_attendee_id_idx`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
  CONSTRAINT `fk_attendee_ecosystem_interests_ecosystem_id_idx`
		FOREIGN KEY (`ecosystem_id`)
		REFERENCES `ecosystems` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

CREATE TABLE `attendee_project_interests` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`attendee_id` INT UNSIGNED NOT NULL,
	`type` ENUM('CREATE', 'CONTRIBUTE', 'SUGGEST') NOT NULL,
	`project_id` INT UNSIGNED NULL,
	`attendee_project_id` INT UNSIGNED NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_attendee_project_interests_attendee_id_idx` (`attendee_id` ASC),
	INDEX `fk_attendee_project_interests_attendee_project_id_idx` (`attendee_project_id` ASC),
	INDEX `fk_attendee_project_interests_project_id_idx` (`project_id` ASC),
	CONSTRAINT `fk_attendee_project_interests_project_id`
		FOREIGN KEY (`project_id`)
		REFERENCES `projects` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_attendee_project_interests_attendee_id`
		FOREIGN KEY (`attendee_id`)
		REFERENCES `attendees` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_attendee_project_interests_attendee_project_id`
		FOREIGN KEY (`attendee_project_id`)
		REFERENCES `attendee_projects` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

ALTER TABLE `attendees`
ADD COLUMN `has_lightning_interest` TINYINT(1) NULL DEFAULT 0 AFTER `is_private`;

INSERT INTO `mailing_lists` (`name`) VALUES ('lightning_talks');

ALTER TABLE `attendees`
ADD COLUMN `priority` TINYINT(1) UNSIGNED NULL DEFAULT 0 AFTER `phone_number`,
ADD COLUMN `wave` TINYINT(1) UNSIGNED NULL DEFAULT 0 AFTER `priority`,
ADD COLUMN `reviewer` VARCHAR(255) NULL DEFAULT NULL AFTER `wave`,
ADD COLUMN `review_time` TIMESTAMP NULL DEFAULT NULL AFTER `reviewer`,
ADD COLUMN `accepted_ecosystem_id` INT(10) UNSIGNED NULL DEFAULT NULL AFTER `review_time`,
ADD COLUMN `acceptance_type` ENUM('CREATE', 'CONTRIBUTE') NULL DEFAULT NULL AFTER `accepted_ecosystem_id`,
ADD INDEX `fk_attendees_ecosystem_id_idx` (`accepted_ecosystem_id` ASC);
ALTER TABLE `attendees`
ADD CONSTRAINT `fk_attendees_ecosystem_id`
  FOREIGN KEY (`accepted_ecosystem_id`)
  REFERENCES `ecosystems` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

INSERT INTO `mailing_lists` (`name`) VALUES ('wave_1');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_2');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_3');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_4');
INSERT INTO `mailing_lists` (`name`) VALUES ('wave_5');
INSERT INTO `mailing_lists` (`name`) VALUES ('rejected');

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
