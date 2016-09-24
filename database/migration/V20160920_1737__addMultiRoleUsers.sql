ALTER TABLE `users`
DROP COLUMN `registered`,
DROP COLUMN `role`;

CREATE TABLE `user_roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `role` ENUM('ADMIN', 'STAFF', 'MENTOR', 'SPONSOR', 'ATTENDEE', 'VOLUNTEER') NOT NULL,
  `active` TINYINT(1) UNSIGNED NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_users_user_roles_id_idx` (`user_id` ASC),
  CONSTRAINT `fk_users_user_roles_id`
	FOREIGN KEY (`user_id`)
	REFERENCES `users` (`id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION);
