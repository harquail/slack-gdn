# slack-gdn

[Demo Video](https://www.youtube.com/watch?v=bBdAoHpn1MU)

A Slack integration (slash command) for The Guardian's content API.  Remembers recently-posted articles, so it does not repeat itself.

## Usage

/gdn [search term] [optionally, number of articles]

Run using node.js — requires setting GUARDIAN_KEY to a [Guardian API key](http://open-platform.theguardian.com/access/).  Information on adding commands to Slack [here](https://api.slack.com/slash-commands).

## Limitations

Currently limited to posting 5 articles at a time, because integrations can only post 5 times per invocation.
