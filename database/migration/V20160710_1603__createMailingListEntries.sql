CREATE TABLE `mailing_list_entries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `list` ENUM('idlers', 'applicants', 'accepted', 'waitlisted', 'software', 'hardware', 'open_source', 'admins', 'staff', 'sponsors', 'mentors', 'volunteers') NOT NULL,
  PRIMARY KEY (`id`));
