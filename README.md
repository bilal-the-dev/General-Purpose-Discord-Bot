# Discord Bot README

## Introduction

Welcome to the Discord Bot README! This bot provides a ticketing feature for your server, allowing users to create tickets for different categories, and also includes a welcome and leave message feature. Below you will find detailed instructions on how to set up and use these features.

## Features

### Ticketing System

- **Create tickets for different categories**
- **Categories:**
  - Purchase Premium
  - Report An Issue
  - Others
  - Ability to add unlimited categories
- **Staff role pings when a ticket is opened**
- **Transcript channel to store ticket transcripts**

### Welcome/Leave Messages

- **Customizable welcome and leave messages**
- **Mention user and server name in messages**

## Commands

### /setup ticket

Set up the ticket system with the following options:

- **channel (required):** The channel where the embed message for creating tickets will be sent.
- **transcripción_channel (required):** The channel where the ticket transcripts will be sent.
- **staff_role (required):** The role that will be pinged when a ticket is opened.

#### Example:

```
/setup ticket
  channel: #tickets
  transcripción_channel: #transcripts
  staff_role: @Support
```

### /setup welcome_leave

Set up the welcome and leave messages with the following options:

- **type (required):** The type of message, either "bienvenido" (welcome) or "dejar" (leave).
- **mensaje (required):** The message to be sent. Use `${user}` to mention the user and `${server}` to mention the server name.

#### Example:

```
/setup welcome_leave
  type: bienvenido
  mensaje: "Welcome ${user} to ${server}!"
```

## Ticket Categories

Configure ticket categories in the `categories` section of your configuration. You can add as many categories as needed.

Example configuration:

```json
{
	"categories": {
		"Purchase Premium": {
			"categoryId": "1256277141008420864",
			"description": "Make a purchase",
			"icon": "🧨"
		},
		"Report An Issue": {
			"categoryId": "1256277287142166568",
			"description": "Report an issue",
			"icon": "🎨"
		},
		"Others": {
			"categoryId": "1256277335754281020",
			"description": "Other issues",
			"icon": "🎱"
		}
	}
}
```

To add more categories, simply follow the structure of the existing ones.

## Setting Up the Bot

2. **Run the `/setup ticket` command to configure the ticket system.**
3. **Run the `/setup welcome_leave` command to configure the welcome and leave messages.**
4. **Install dependencies with `npm install`.**
5. **Start the bot with `npm start`.**

## Usage

- **Users can create tickets by interacting with the embed message in the specified channel.**
- **Staff will be pinged, and tickets will be managed in their respective channels.**
- **Welcome and leave messages will be sent automatically when users join or leave the server.**
