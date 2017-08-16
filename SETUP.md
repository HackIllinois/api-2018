# Setup

## Overview

We use Node.js + Express in the application layer. MySQL is used as our primary datastore in the persistence layer and Redis is used as our primary cache.

You do not have to set up any of these components yourself!

## Environment

A development environment is available as a Vagrant box. To use it, you must have Vagrant, Virtualbox, and rsync installed. If you are in a \*nix-like environment you probably have rsync installed already. Windows 10+ users should use the Windows Linux Subsystem. Then, from the project directory, run `vagrant up`.

By default, the box forwards ports 8080 and 3306 for the application and database, respectively. If you would like to change these defaults, set `VAGRANT_APP_PORT` and/or `VAGRANT_DB_PORT` as environment variables prior to running `vagrant up` (e.g. `VAGRANT_DB_PORT=3305 vagrant up`).

## Configuration

Go to the `config` directory on your local (host) machine and copy `dev.config.template` to `dev.config`. You'll need to do this to let the API know the configuration details for the environment you're working in (the defaults in that file match up with what's in the Vagrant box, so there's no need to change anything).

## Changes

To avoid build issues, we use rsync instead of Virtualbox's shared folders (Vagrant's default). In order to make sure syncing occurs properly, we make `npm run bridge` available. This sets up auto-syncing from your machine to the virtual guest and connects you to the guest via ssh.

Once connected to the machine via the bridge, you can start the development server with `npm run dev` (inside the virtual guest). The dev server auto-reloads when it receives changes from rsync, which means that you can edit the source from your host machine and expect changes to be deployed immediately (unless there are errors).

Any changes to migrations or dependencies will require stopping the server, running any necessary migrations or package updates, and then restarting the development server via `npm run dev`.

Finally, note that rsync is a host-to-guest sync, so any source changes made directly on the Vagrant box **will be overwritten** when you make changes on your local (host) machine! Treat the guest machine as a deployment target.

## Other Information
Be sure to read the [database README](/database/README.md) if you plan to work on issues that have the `database` tag. It has important information that you'll want to be familiar with.
