# Scavenger Hunt

Web platform for playing scavenger hunts 

[Web demo available on request]

## Prototype Description

In the current prototype, users are able to choose a predefined itinerary and invite players to join a game. The application tracks a player based on their geolocation and shows their location on a Google maps interface where they can see their destinations one at a time. Once they are within a certain distance of their destination, a challenge question/task associated with the location pops up, and the player must answer it correctly within 3 tries to obtain a certain amount of points before the next destination is revealed. When all players have completed all the destinations and challenges, the winner with the highest score is announced.

Key interactive map features include geolocation watching and automatic map panning and centering with user movement, displaying distance between user and next destination, zoomout function for displaying both user and destination within the map boundaries, centering the user on the map when user has been panned off screen, and an arrow displaying the direction of the destination when the destination is off screen.

## Technology stack

### Front end
- JavaScript, jQuery, HTML, CSS, Bootstrap

### Back end
- Node.js, with Express.js, Handlebars.js, Passport.js (OAuth via Google) 
- PostgreSQL with Sequelize as ORM
- Unit testing with Jasmine
- VPS setup with Ubuntu, pm2, and nginx

### APIs
- Google Maps JavaScript API

### Development and deployment tools
- ngrok (localhost webhook)
- xip.io (wildcard DNS)

## Improvements to be made
- Better UI, particularly game setup and various menus
- Better UX
  - Make game setup more intuitive and user friendly 
  - Improve -- or allow user to customize -- map styling and features (e.g., streets are not currently shown)
- Include option and functionality of imposing a time limit on a gameplay, and record player completion time as a factor in determining a winner
- HTTPS setup to enable cross-browser functionality

## Contributors
- Herman Leung (@ermanh), Perry Luo (@perryluo), Miguel Suay (@miguelsuay)
- Special thanks to Thilo Roth (@thiloo) and Gordon Lau (@gordonlau) for their guidance and expertise
