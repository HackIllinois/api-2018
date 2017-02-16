CREATE TABLE `checkins` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `location` ENUM('SIEBEL', 'ECEB', 'DCL') NOT NULL,
    `swag` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    INDEX `fk_checkins_user_id` (`user_id` ASC),
    CONSTRAINT `fk_checkins_user_id`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
