CREATE TABLE `recruiters` (
    `user_id` INT UNSIGNED NOT NULL,
    `company_name` VARCHAR(50),
    CONSTRAINT `fk_recruiters_user_id`
      FOREIGN KEY (`user_id`)
      REFERENCES `users` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE `job_applicants` (
  `app_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `recruiter_id` INT UNSIGNED NOT NULL,
  `applicant_id` INT UNSIGNED NOT NULL,
  `comments` VARCHAR(255) NOT NULL,
  `favorite` INT UNSIGNED NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`app_id`),
  CONSTRAINT `fk_applicants_recruiters_id`
    FOREIGN KEY (`recruiter_id`)
    REFERENCES `recruiters` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
