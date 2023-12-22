function weatherCondition(temperature, windspeed, humidity) {
    const conditions = [
        { cond: temperature < 0, image: "snow.png" },
        { cond: humidity > 90 && temperature > 20, image: "rain.png" },
        { cond: humidity > 90 && temperature <= 20, image: "drizzle.png" },
        { cond: humidity > 80 && temperature < 10, image: "mist.png" },
        { cond: humidity > 80, image: "humidity.png" },
        { cond: windspeed > 20, image: "wind.png" },
        { cond: humidity > 60, image: "clouds.png" },
    ];

    const matchedImage = conditions.find(condObj => condObj.cond)?.image;
    return matchedImage || "clear.png";
}

module.exports = { weatherCondition };