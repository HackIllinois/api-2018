CREATE TABLE `stats` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(255) NOT NULL,
  `stat` VARCHAR(255) NOT NULL,
  `field` VARCHAR(255) NOT NULL,
  `count` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_unique_stats` UNIQUE (`category`, `stat`, `field`)
);

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'NOT_NEEDED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'BUS_REQUESTED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'IN_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'OUT_OF_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'transportation', 'INTERNATIONAL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'diet', 'VEGETARIAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'diet', 'VEGAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'diet', 'NONE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'diet', 'GLUTEN_FREE');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'shirtSize', 'S');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'shirtSize', 'M');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'shirtSize', 'L');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'shirtSize', 'XL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'gender', 'MALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'gender', 'FEMALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'gender', 'NON_BINARY');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'gender', 'OTHER');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'isNovice', '0');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('registration', 'isNovice', '1');

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

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'shirtSize', 'S');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'shirtSize', 'M');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'shirtSize', 'L');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'shirtSize', 'XL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'gender', 'MALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'gender', 'FEMALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'gender', 'NON_BINARY');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'gender', 'OTHER');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'isNovice', '0');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'isNovice', '1');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'attendees', 'count');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('rsvp', 'status', 'ACCEPTED');


INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'transportation', 'NOT_NEEDED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'transportation', 'BUS_REQUESTED');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'transportation', 'IN_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'transportation', 'OUT_OF_STATE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'transportation', 'INTERNATIONAL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'diet', 'VEGETARIAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'diet', 'VEGAN');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'diet', 'NONE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'diet', 'GLUTEN_FREE');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'shirtSize', 'S');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'shirtSize', 'M');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'shirtSize', 'L');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'shirtSize', 'XL');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'gender', 'MALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'gender', 'FEMALE');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'gender', 'NON_BINARY');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'gender', 'OTHER');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'isNovice', '0');
INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'isNovice', '1');

INSERT INTO `stats` (`category`, `stat`, `field`) VALUES ('liveEvent', 'attendees', 'count');
