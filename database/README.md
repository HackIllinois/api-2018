# HackIllinois Database

### Migrations
We'll be using FlywayDB to keep our database schema in sync (you should have this command line utility from when you set up your database initially). The `migration` folder will keep track of all migrations, with each migration following this naming convention:
> [YYYYmmDD]\_[HHMM]\__[description].sql

A migration that creates a new table called `foo` on 6/15/2016 at 12:00 PM might look like this:

> 20161506\_1200__createFooModel.sql

Since this is painful to type for every migration, use the shell script called `migration.sh` to generate this file name. To generate the above migration file name, run:

> migration.sh createFooModel

### Reverts
Although FlywayDB does not have the ability to revert migrations for us, having a quick way to revert a previous migration may be useful in production hotfixes. The naming convention is exactly the same as that which is above, but should be placed in the `revert` folder, and have a `.revert.sql` ending:

> [YYYYmmDD]\_[HHMM]\__[description].revert.sql

You can typically just use the same output from the `migration.sh` script to name your revert, taking care to add the `.revert.sql` filename ending.

### Table and Column Naming
Let's have tables always represent the data that they hold per row, as a plural entity. Columns should be singular entities. Additionally, all letters should be lowercase. For example, always make a table like `foos`, not like `foo`, `Foo`, or `Foos`.

In any case, make sure to exchange places where spaces would normally be inserted with underscores.

### Cascading ON UPDATE/DELETE
As a reference, please read the marked answer to [this StackOverflow response](http://stackoverflow.com/questions/6720050/foreign-key-varraints-when-to-use-on-update-and-on-delete).

Overall, it's saying that you usually (but not always) want to cascade ON UPDATE. However, for ON DELETE operations, you need to think carefully.

For instance, if the foreign key is from a user to his/her organization, cascading on delete would be very bad -- deleting the organization would delete
the user as well!

If you're not sure which to pick, make your best guess and leave a justification with a TODO for your code reviewer(s) to check out.

### Deploying Schema Changes

We will come back to this once we are ready to release. However, note that it is generally a good idea to check the timestamps of the upcoming release's
schema changes before actually releasing, so as to ensure that no date-time conflicts happen with flyway.
