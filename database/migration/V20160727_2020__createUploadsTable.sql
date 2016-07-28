CREATE TABLE `uploads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner_id` INT UNSIGNED NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `bucket` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `disposition` ENUM('PDF', 'UNKNOWN') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_uploads_owner_id_idx` (`owner_id` ASC),
  CONSTRAINT `fk_uploads_owner_id`
	FOREIGN KEY (`owner_id`)
	REFERENCES `users` (`id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION);
