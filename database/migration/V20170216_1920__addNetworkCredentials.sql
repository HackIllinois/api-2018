CREATE TABLE `network_credentials` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL,
  `account` VARCHAR(25) NOT NULL,
  `password` VARCHAR(25) NOT NULL,
  `assigned` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_network_credentials_user_id_idx` (`user_id` ASC),
  CONSTRAINT `fk_network_credentials_user_id`
	FOREIGN KEY (`user_id`)
	REFERENCES `users` (`id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
