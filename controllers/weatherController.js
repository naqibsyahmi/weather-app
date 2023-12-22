const axios = require("axios");
const { 
    OPENMETEO_API_URL, 
    OPENCAGE_API_URL, 
    OPENCAGE_API_KEY 
} = require("../config/envConfig");
const { weatherCondition } = require("../utils/utils");

async function fetchOpenCageData(city) {
    const response = await axios.get(OPENCAGE_API_URL, {
        params: {
            key: OPENCAGE_API_KEY,
            q: city,
            limit: 1,
        },
    });
    if (!response.data || response.data.results.length === 0) {
        throw new Error("CityNotFound");
    }
    return response.data.results[0];
}

async function fetchOpenMeteodata(latitude, longitude) {
    const response = await axios.get(OPENMETEO_API_URL, {
        params: {
            latitude,
            longitude,
            current_weather: true,
            hourly: ["temperature_2m", "windspeed_10m", "relativehumidity_2m"]
        }
    });
    if (!response.data || !response.data.current_weather) {
        throw new Error("Failed to fetch weather data");
    }
    return response.data;
}

const weatherRoute = async (req, res) => {

    // Extract the location from the query string
    const city = req.query.city;

    // Prevent users to proceed to the Weather Results page without specifying the city
    // if (!city) return res.redirect("/");

    const trimmedCity = city ? city.trim() : "";

    if (!trimmedCity) return res.render("index", { errorMessage: "Please enter a valid city name.", userInput: city });
    
    try {
        const openCageData = await fetchOpenCageData(trimmedCity);
        const normalizedInput = trimmedCity.toLowerCase();
        const normalizedCity = (openCageData.components.city || openCageData.components.state || 
                                openCageData.components.country || "").toLowerCase();

        if (!normalizedCity.includes(normalizedInput)) {
            return res.render("index", { errorMessage: "Please enter a valid city name." });
        }

        const openMeteoData = await fetchOpenMeteodata(openCageData.geometry.lat, openCageData.geometry.lng);

        const hourlyData = openMeteoData.hourly.time.map((timestamp, index) => ({
            time: new Date(timestamp).toLocaleTimeString(),
            temperature: openMeteoData.hourly.temperature_2m[index],
            image: weatherCondition(
                openMeteoData.hourly.temperature_2m[index],
                openMeteoData.hourly.windspeed_10m[index],
                openMeteoData.hourly.relativehumidity_2m[index],
            )
        }));

        const weatherData = {
            cityLocation: openCageData.formatted,
            latitude: openCageData.geometry.lat,
            longitude: openCageData.geometry.lng,
            temperature: openMeteoData.current_weather.temperature,
            windSpeed: openMeteoData.current_weather.windspeed,
            windDirection: openMeteoData.current_weather.winddirection,
            hourlyData: hourlyData
        };

        res.render("weatherResult", { weatherData });

    } catch (error) {
        console.error("Error:", error);

        if (error.message === "CityNotFound") {
            return res.render("index", { errorMessage: "The provided city could not be found. Please try again." });
        }
        
        const errorMessage = error.response && error.response.status === 400
        ? "Bad Request"
        : "An error occurred while fetching data. Please try again";
        res.status(error.response ? error.response.status : 500).render("index", { errorMessage, userInput: city });
    }
};

module.exports = { weatherRoute };

       