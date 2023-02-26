# Honk @ fisherman
## Changes
 - side menu [[image]](/docs/screenshot-webui.png)
 - simple action menu with reduced layout shift
 - refactoring javascript
 - disable inline img [[commit]](https://github.com/Umio-Yasuno/honk-fisherman/commit/d01a918dd411ff3e7de21a989aa36942a5c0764d)
 - fold the DZ (danzer zone/sentensive post)
 - add `loading="lazy"` to img tag
 - Markdown support for AboutMsg, ServerMsg, LoginMsg [[commit]](https://github.com/Umio-Yasuno/honk-fisherman/commit/577bd917acf8a92416dff9871897160f842e5d12)

==============

honk

-- features

Take control of your honks and join the federation.
An ActivityPub server with minimal setup and support costs.
Spend more time using the software and less time operating it.

No attention mining.
No likes, no faves, no polls, no stars, no claps, no counts.

Purple color scheme. Custom emus. Memes too.
Avatars automatically assigned by the NSA.

The button to submit a new honk says "it's gonna be honked".

The honk mission is to work well if it's what you want.
This does not imply the goal is to be what you want.

-- build

It should be sufficient to type make after unpacking a release.
You'll need a go compiler version 1.16 or later. And libsqlite3.

Even on a fast machine, building from source can take several seconds.

Development sources: hg clone https://humungus.tedunangst.com/r/honk

-- setup

honk expects to be fronted by a TLS terminating reverse proxy.

First, create the database. This will ask four questions.
./honk init
username: (the username you want)
password: (the password you want)
listenaddr: (tcp or unix: 127.0.0.1:31337, /var/www/honk.sock, etc.)
servername: (public DNS name: honk.example.com)

Then run honk.
./honk

-- upgrade

old-honk backup `date +backup-%F`
./honk upgrade
./honk

-- documentation

There is a more complete incomplete manual. This is just the README.

-- guidelines

One honk per day, or call it an "eighth-tenth" honk.
If your honk frequency changes, so will the number of honks.

The honk should be short, but not so short that you cannot identify it.

The honk is an animal sign of respect and should be accompanied by a
friendly greeting or a nod.

The honk should be done from a seat and in a safe area.

It is considered rude to make noise in a place of business.

The honk may be made on public property only when the person doing
the honk has the permission of the owner of that property.

-- disclaimer

Do not use honk to contact emergency services.
