CREATE TABLE `tokens` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('AUTH', 'OTHER') NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_token_users_user_id_idx` (`user_id` ASC),
  CONSTRAINT `fk_token_users_user_id`
  FOREIGN KEY (`user_id`) 
  REFERENCES `users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION
 );