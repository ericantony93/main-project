def calculate_aqi(pm25):
    """
    Basic AQI calculator based on PM2.5 concentration.
    Simplified logic for demo purposes.
    """

    if pm25 <= 12:
        return 50, "Good"
    elif pm25 <= 35.4:
        return 100, "Moderate"
    elif pm25 <= 55.4:
        return 150, "Unhealthy for Sensitive Groups"
    elif pm25 <= 150.4:
        return 200, "Unhealthy"
    elif pm25 <= 250.4:
        return 300, "Very Unhealthy"
    else:
        return 500, "Hazardous"
