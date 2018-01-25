CREATE TABLE `stats` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(255) NOT NULL,
  `stat` VARCHAR(255) NOT NULL,
  `field` VARCHAR(255) NOT NULL,
  `count` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_unique_stats` UNIQUE (`category`, `stat`, `field`)
);

# schools
# graduation year
# major

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'NOT_NEEDED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'BUS_REQUESTED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'IN_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'OUT_OF_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'INTERNATIONAL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'diet', 'VEGETARIAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'diet', 'VEGAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'diet', 'NONE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'diet', 'GLUTEN_FREE');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'shirt_size', 'S');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'shirt_size', 'M');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'shirt_size', 'L');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'shirt_size', 'XL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'gender', 'MALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'gender', 'FEMALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'gender', 'NON_BINARY');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'gender', 'OTHER');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'is_novice', '0');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'is_novice', '1');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'attendees', 'count');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'status', 'ACCEPTED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'status', 'WAITLISTED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'status', 'REJECTED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'status', 'PENDING');



INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'transportation', 'NOT_NEEDED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'transportation', 'BUS_REQUESTED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'transportation', 'IN_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'transportation', 'OUT_OF_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'transportation', 'INTERNATIONAL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'diet', 'VEGETARIAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'diet', 'VEGAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'diet', 'NONE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'diet', 'GLUTEN_FREE');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'shirt_size', 'S');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'shirt_size', 'M');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'shirt_size', 'L');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'shirt_size', 'XL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'gender', 'MALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'gender', 'FEMALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'gender', 'NON_BINARY');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'gender', 'OTHER');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'is_novice', '0');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'is_novice', '1');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'attendees', 'count');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'status', 'ACCEPTED');
#INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', `status`, `WAITLISTED`);
#INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', `status`, `REJECTED`);
#INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', `status`, `PENDING`);



INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'transportation', 'NOT_NEEDED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'transportation', 'BUS_REQUESTED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'transportation', 'IN_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'transportation', 'OUT_OF_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'transportation', 'INTERNATIONAL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'diet', 'VEGETARIAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'diet', 'VEGAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'diet', 'NONE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'diet', 'GLUTEN_FREE');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'shirt_size', 'S');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'shirt_size', 'M');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'shirt_size', 'L');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'shirt_size', 'XL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'gender', 'MALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'gender', 'FEMALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'gender', 'NON_BINARY');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'gender', 'OTHER');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'is_novice', '0');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'is_novice', '1');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', 'attendees', 'count');

#INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', `status`, `ACCEPTED`);
#INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', `status`, `WAITLISTED`);
#INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', `status`, `REJECTED`);
#INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveevent', `status`, `PENDING`);
