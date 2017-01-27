# The changes made by this migration cannot entirely be reversed
# We will not be able to add back the correct value to the role column

ALTER TABLE `users`
ADD COLUMN `role` ENUM('ADMIN', 'STAFF', 'MENTOR', 'SPONSOR', 'HACKER', 'VOLUNTEER') NOT NULL DEFAULT 'HACKER' AFTER `password`,
ADD COLUMN `registered` DATETIME NULL DEFAULT NULL AFTER `role`;
