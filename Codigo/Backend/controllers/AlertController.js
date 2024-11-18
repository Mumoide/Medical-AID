// alerts.controller.js
const { Alerts, AlertGeoLocation, UserAlerts, Users } = require("../models");

const createAlert = async (req, res) => {
    const { title, description, alert_type, latitude, longitude, region } = req.body;

    // Define allowed values for alert_type and region
    const allowedAlertTypes = ["Grave", "Moderada", "Leve"];
    const allowedRegions = [
        "Arica-Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso",
        "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Bío Bío", "Araucanía", "Los Ríos",
        "Los Lagos", "Aysén", "Magallanes y Antártica Chilena", "Todas las regiones"
    ];

    // Validate title
    if (!title || title.length > 50) {
        return res.status(400).json({ message: "Title is required and must not exceed 50 characters." });
    }

    // Validate description
    if (!description || description.length > 255) {
        return res.status(400).json({ message: "Description is required and must not exceed 255 characters." });
    }

    // Validate alert_type
    if (!allowedAlertTypes.includes(alert_type)) {
        return res.status(400).json({ message: "Alert type is invalid. Must be one of Grave, Moderada, or Leve." });
    }

    // Validate region
    if (!allowedRegions.includes(region)) {
        return res.status(400).json({ message: "Region is invalid. Please select a valid region." });
    }

    // Validate latitude and longitude
    const isValidCoordinate = (coord) => /^-?\d+(\.\d+)?$/.test(coord);
    if (!isValidCoordinate(latitude) || latitude < -90 || latitude > 90) {
        return res.status(400).json({ message: "Latitude is invalid. Must be a number between -90 and 90." });
    }
    if (!isValidCoordinate(longitude) || longitude < -180 || longitude > 180) {
        return res.status(400).json({ message: "Longitude is invalid. Must be a number between -180 and 180." });
    }

    try {
        // Start a transaction to ensure all operations succeed or none
        const result = await Alerts.sequelize.transaction(async (transaction) => {
            const id_admin = req.user.id_user;
            // 1. Create the alert in the Alerts table
            const newAlert = await Alerts.create(
                {
                    title,
                    description,
                    alert_type,
                    id_admin  // Assuming `id_admin` is in the authenticated user's session
                },
                { transaction }
            );

            // 2. Insert geolocation data for the created alert
            const alertGeoLocation = await AlertGeoLocation.create(
                {
                    id_alert: newAlert.id_alert,
                    latitude,
                    longitude,
                    region,
                },
                { transaction }
            );

            // 3. Retrieve all users and create UserAlerts entries
            const users = await Users.findAll({ attributes: ["id_user"] });
            const userAlerts = users.map((user) => ({
                id_user: user.id_user,
                id_alert: newAlert.id_alert,
                readed: false, // Default read status to false
            }));
            await UserAlerts.bulkCreate(userAlerts, { transaction });

            return { newAlert, alertGeoLocation };
        });

        res.status(201).json({
            message: "Alert created successfully",
            alert: result.newAlert,
            geolocation: result.alertGeoLocation,
        });
    } catch (error) {
        console.error("Error creating alert:", error);
        res.status(500).json({
            message: "Failed to create alert",
            error: error.message,
        });
    }
};

const getUserAlerts = async (req, res) => {
    const userId = req.user.id_user; // Assumes user ID is available from the authenticated request

    try {
        const alerts = await UserAlerts.findAll({
            where: { id_user: userId },
            attributes: ['readed'],
            include: [
                {
                    model: Alerts,
                    as: 'alert',
                    attributes: ['title', 'description', 'alert_type', 'createdAt'],
                    include: [
                        {
                            model: AlertGeoLocation,
                            as: 'geoLocation',
                            attributes: ['latitude', 'longitude', 'region']
                        }
                    ]
                }
            ]
        });

        const formattedAlerts = alerts.map(alert => ({
            title: alert.alert.title,
            description: alert.alert.description,
            alert_type: alert.alert.alert_type,
            created_at: alert.alert.createdAt,
            readed: alert.readed,
            latitude: alert.alert.geoLocation.latitude,
            longitude: alert.alert.geoLocation.longitude,
            region: alert.alert.geoLocation.region
        }));

        return res.status(200).json(formattedAlerts);
    } catch (error) {
        console.error('Error retrieving user alerts:', error);
        res.status(500).json({ message: 'Error retrieving alerts' });
    }
};

module.exports = { createAlert, getUserAlerts };
