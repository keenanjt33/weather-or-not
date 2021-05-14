# weather-or-not

## About

This is a simple weather web application built with Express and React

## Setup

Install [Node.js v14.x](https://nodejs.org/en/download/)

Clone this repository: `git clone https://github.com/keenanjt33/weather-or-not.git`

- _Note_: If you don't have `git` installed, install it by following
  [these instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

Install dependencies:

`npm install && cd client && npm install && cd ..`

Set up an AccuWeather [developer account](https://developer.accuweather.com/)
then register an [app](https://developer.accuweather.com/user/me/apps)

Create a file called `.env` in the repository's root directory and add the line:

```
WEATHER_KEY='<accuweather_app_api_key>'
```

Where `<accuweather_app_api_key>` is the API key registered to your AccuWeather
app

Run the app:

`npm run start`
