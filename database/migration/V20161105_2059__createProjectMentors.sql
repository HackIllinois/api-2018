CREATE TABLE `project_mentors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` INT UNSIGNED NOT NULL,
  `mentor_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_project_mentors_projects_id_idx` (`project_id` ASC),
  INDEX `fk_project_mentors_mentors_id_idx` (`mentor_id` ASC),
  CONSTRAINT `project_id`
    FOREIGN KEY (`mentor_id`)
    REFERENCES `projects` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `mentor_id`
    FOREIGN KEY (`mentor_id`)
    REFERENCES `mentors` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
