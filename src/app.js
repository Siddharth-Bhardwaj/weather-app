const path = require("path");
const express = require("express");
const hbs = require("hbs");
const weather = require("openweather-apis");

const app = express();

// define paths for express congig
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
var weatherData = {};

// setting views and handlebars
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
const appID = "fddc821db8897d4c95367ee1f0a0a441";
weather.setAPPID(appID);
weather.setLang("en");

//set up static directory to serve
app.use(express.static(publicDirectoryPath));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("./img"));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Siddharth",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Siddharth",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Siddharth",
    helpText: "This is some help text",
  });
});

app.get("/help/*", (req, res) => {
  res.render("help404", {
    title: "Help",
    name: "Siddharth",
  });
});

app.post("/submit-form", (req, res) => {
  const city = req.body.city;
  weather.setCity(city);
  weather.getAllWeather(function (err, JSONObj) {
    console.log(JSONObj);
  });
  //...
  res.redirect("/");
});

app.get("/weather", (req, res) => {
  //console.log(req.query);
  if (!req.query.city) {
    return res.redirect("/");
  }
  //console.log(req.query);
  const city = req.query.city;
  weather.setCity(city);
  weather.getAllWeather((err, JSONObj) => {
    weatherData = JSONObj;
    res.redirect("/result");
  });

  //console.log(weatherData);
  //res.send(weatherData);
});

app.get("/result", (req, res) => {
  if (weatherData.cod == 404) {
    res.redirect("/");
  } else {
    console.log(weatherData);
    var imgURL;
    if (weatherData.weather[0].icon == "01d") {
      imgURL = "039-sun.png";
    } else if (weatherData.weather[0].icon == "01n") {
      imgURL = "022-night-3.png";
    } else if (weatherData.weather[0].icon == "02d") {
      imgURL = "038-cloudy-3.png";
    } else if (weatherData.weather[0].icon == "02n") {
      imgURL = "002-cloud-1.png";
    } else if (weatherData.weather[0].icon == "03d") {
      imgURL = "001-cloud.png";
    } else if (weatherData.weather[0].icon == "03n") {
      imgURL = "001-cloud.png";
    } else if (weatherData.weather[0].icon == "04d") {
      imgURL = "011-cloudy.png";
    } else if (weatherData.weather[0].icon == "04n") {
      imgURL = "011-cloudy.png";
    } else if (weatherData.weather[0].icon == "09d") {
      imgURL = "003-rainy.png";
    } else if (weatherData.weather[0].icon == "09n") {
      imgURL = "003-rainy.png";
    } else if (weatherData.weather[0].icon == "10d") {
      imgURL = "034-cloudy-1.png";
    } else if (weatherData.weather[0].icon == "10n") {
      imgURL = "021-night-2.png";
    } else if (weatherData.weather[0].icon == "11d") {
      imgURL = "008-storm.png";
    } else if (weatherData.weather[0].icon == "11n") {
      imgURL = "008-storm.png";
    } else if (weatherData.weather[0].icon == "13d") {
      imgURL = "031-snowflake.png";
    } else if (weatherData.weather[0].icon == "13n") {
      imgURL = "031-snowflake.png";
    } else if (weatherData.weather[0].icon == "50d") {
      imgURL = "050-windy-3.png";
    } else if (weatherData.weather[0].icon == "50n") {
      imgURL = "050-windy-3.png";
    }
    var lat;
    var lon;
    if (weatherData.coord.lat >= 0) {
      lat = weatherData.coord.lat + "N";
    } else {
      lat = -weatherData.coord.lat + "S";
    }
    if (weatherData.coord.lon >= 0) {
      lon = weatherData.coord.lon + "E";
    } else {
      lon = -weatherData.coord.lon + "W";
    }
    res.render("result", {
      title: "Weather",
      name: "Siddharth",
      temperature: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      latitude: lat,
      longitude: lon,
      main: weatherData.weather[0].main,
      windSpeed: weatherData.wind.speed,
      cityName: weatherData.name,
      timeZone: weatherData.timezone,
      clouds: weatherData.clouds.all,
      visibility: weatherData.visibility,
      iconSrc: imgURL,
    });
  }
});

app.get("*", (req, res) => {
  res.render("err404", {
    title: "Error 404",
    name: "Siddharth",
  });
});

app.listen(3000, () => {
  console.log("Server running at localhost/3000");
});
