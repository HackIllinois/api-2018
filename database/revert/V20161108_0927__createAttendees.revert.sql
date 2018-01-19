DROP TABLE `attendee_rsvps`;
DROP TABLE `attendee_extra_infos`;
DROP TABLE `attendee_long_form`;
DROP TABLE `attendee_os_contributor`;
DROP TABLE `attendee_requested_collaborators`;

DELETE FROM `mailing_lists` WHERE `name`='wave_1';
DELETE FROM `mailing_lists` WHERE `name`='wave_2';
DELETE FROM `mailing_lists` WHERE `name`='wave_3';
DELETE FROM `mailing_lists` WHERE `name`='wave_4';
DELETE FROM `mailing_lists` WHERE `name`='wave_5';
DELETE FROM `mailing_lists` WHERE `name`='rejected';
DELETE FROM `mailing_lists` WHERE `name`='lightning_talks';

DROP TABLE `attendees`;
