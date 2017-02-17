DROP TABLE `attendee_rsvps`;
DELETE FROM `mailing_lists` WHERE `name`='attendees';
INSERT INTO `mailing_lists` (`name`) VALUES ('software');
INSERT INTO `mailing_lists` (`name`) VALUES ('hardware');
INSERT INTO `mailing_lists` (`name`) VALUES ('open_source');