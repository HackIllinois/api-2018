CREATE TABLE `mailing_lists` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `mailing_lists_name_UNIQUE` (`name` ASC));

CREATE TABLE `mailing_lists_users` (
  `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mailing_list_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_mailing_lists_users_user_id_idx` (`user_id` ASC),
  INDEX `fk_mailing_lists_users_mailing_list_id_idx` (`mailing_list_id` ASC),
  CONSTRAINT `fk_mailing_lists_users_user_id`
	FOREIGN KEY (`user_id`)
	REFERENCES `users` (`id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION,
  CONSTRAINT `fk_mailing_lists_users_mailing_list_id`
	FOREIGN KEY (`mailing_list_id`)
	REFERENCES `mailing_lists` (`id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION);

INSERT INTO `mailing_lists` (`name`) VALUES ('idlers');
INSERT INTO `mailing_lists` (`name`) VALUES ('applicants');
INSERT INTO `mailing_lists` (`name`) VALUES ('accepted');
INSERT INTO `mailing_lists` (`name`) VALUES ('waitlisted');
INSERT INTO `mailing_lists` (`name`) VALUES ('software');
INSERT INTO `mailing_lists` (`name`) VALUES ('hardware');
INSERT INTO `mailing_lists` (`name`) VALUES ('open_source');
INSERT INTO `mailing_lists` (`name`) VALUES ('admins');
INSERT INTO `mailing_lists` (`name`) VALUES ('staff');
INSERT INTO `mailing_lists` (`name`) VALUES ('sponsors');
INSERT INTO `mailing_lists` (`name`) VALUES ('mentors');
INSERT INTO `mailing_lists` (`name`) VALUES ('volunteers');
INSERT INTO `mailing_lists` (`name`) VALUES ('test');
