ALTER TABLE `attendee_rsvps` DROP INDEX `rsvp_UNIQUE`;
ALTER TABLE `attendee_rsvps` ADD CONSTRAINT `rsvp_UNIQUE` UNIQUE (`attendee_id`);
