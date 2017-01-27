CREATE TABLE `mentors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `shirt_size` ENUM('S', 'M', 'L', 'XL') NOT NULL,
  `github` VARCHAR(50) NULL,
  `location` VARCHAR(255) NOT NULL,
  `summary` VARCHAR(255) NOT NULL,
  `occupation` VARCHAR(100) NOT NULL,
  `status` ENUM('ACCEPTED', 'WAITLISTED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  INDEX `fk_mentors_user_id_idx` (`user_id` ASC),
  CONSTRAINT `fk_mentors_user_id`
  FOREIGN KEY (`user_id`)
  REFERENCES `users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION
);

CREATE TABLE `mentor_project_ideas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mentor_id` INT UNSIGNED NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `contributions` VARCHAR(255) NOT NULL,
  `ideas` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_mentor_project_ideas_mentor_id_idx` (`mentor_id` ASC),
  CONSTRAINT `fk_mentor_project_ideas_mentor_id`
  FOREIGN KEY (`mentor_id`)
  REFERENCES `mentors` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION
);
