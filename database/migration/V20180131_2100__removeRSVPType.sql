ALTER TABLE `attendee_rsvps` DROP COLUMN `type`;
ALTER TABLE `attendee_rsvps` ADD CONSTRAINT `rsvp_UNIQUE` UNIQUE (`attendee_id`, `is_attending`);
