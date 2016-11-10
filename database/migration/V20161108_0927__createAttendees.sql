CREATE TABLE `attendees` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) BINARY NOT NULL,
  `shirt_size` ENUM('S', 'M', 'L', 'XL') NOT NULL,
  `diet` ENUM('NONE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE') NOT NULL DEFAULT 'NONE',
  `age` TINYINT UNSIGNED NOT NULL,
  `transportation` ENUM('NOT_NEEDED', 'BUS_REQUESTED', 'IN_STATE', 'OUT_OF_STATE', 'INTERNATIONAL') NOT NULL DEFAULT 'NOT_NEEDED',
  `school` VARCHAR(255) NOT NULL,
  `major` VARCHAR(255) NOT NULL,
  `gender` ENUM('MALE', 'FEMALE', 'NON_BINARY', 'OTHER') NOT NULL,
  `is_novice` TINYINT(1) NOT NULL DEFAULT 0,
  `professional_interest` ENUM('INTERNSHIP', 'FULLTIME', 'BOTH') NOT NULL,
  `github` VARCHAR(50) NOT NULL,
  `interests` VARCHAR(255) NOT NULL,
  `status` ENUM('ACCEPTED', 'WAITLISTED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING',
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

CREATE TABLE `projects` (
    `id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`)
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
        REFERENCES `hackillinois-2017`.`projects` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_attendee_project_interests_attendee_id`
        FOREIGN KEY (`attendee_id`)
        REFERENCES `hackillinois-2017`.`attendees` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_attendee_project_interests_attendee_project_id`
        FOREIGN KEY (`attendee_project_id`)
        REFERENCES `hackillinois-2017`.`attendee_projects` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
