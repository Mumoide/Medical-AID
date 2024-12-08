// alerts.controller.js
const { Alerts, AlertGeoLocation, UserAlerts, Users } = require("../models");
const { Sequelize } = require("sequelize");

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
                    attributes: ['id_alert', 'title', 'description', 'alert_type', 'createdAt', 'updatedAt'],
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
            id_alert: alert.alert.id_alert,
            title: alert.alert.title,
            description: alert.alert.description,
            alert_type: alert.alert.alert_type,
            created_at: alert.alert.createdAt,
            updated_at: alert.alert.updatedAt,
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


const getAlertsWithReadedCount = async (req, res) => {
    try {
        // Fetch all alerts with associated geolocation and count of readed alerts
        const alerts = await Alerts.findAll({
            attributes: [
                "id_alert",
                "id_admin",
                "title",
                "description",
                "alert_type",
                "created_at",
                "updated_at",
                // Use Sequelize literal to count readed alerts
                [
                    Sequelize.literal(
                        `(SELECT COUNT(*) FROM "UserAlerts" AS ua WHERE ua.id_alert = "Alerts".id_alert AND ua.readed = true)`
                    ),
                    "readed_count"
                ]
            ],
            include: [
                {
                    model: AlertGeoLocation,
                    as: "geoLocation",
                    attributes: ["id_geolocation", "latitude", "longitude", "region"],
                }
            ],
        });

        // Format response data
        const formattedAlerts = alerts.map(alert => ({
            id_alert: alert.id_alert,
            id_admin: alert.id_admin,
            title: alert.title,
            description: alert.description,
            alert_type: alert.alert_type,
            created_at: alert.created_at,
            updated_at: alert.updated_at,
            readed_count: alert.dataValues.readed_count, // Access the computed readed_count
            geoLocation: {
                id_geolocation: alert.geoLocation.id_geolocation,
                latitude: alert.geoLocation.latitude,
                longitude: alert.geoLocation.longitude,
                region: alert.geoLocation.region,
            }
        }));
        console.log('alerts: ', alerts)
        console.log('formattedAlerts: ', formattedAlerts)
        res.status(200).json(formattedAlerts);
    } catch (error) {
        console.error("Error fetching alerts with readed count:", error);
        res.status(500).json({
            message: "Error retrieving alerts",
            error: error.message,
        });
    }
};

const updateAlertReadStatus = async (req, res) => {
    const userId = req.user.id_user; // Extract user ID from the authenticated request token
    console.log(userId)
    const { alert_id } = req.body; // Extract alert ID from the request body

    if (!alert_id) {
        return res.status(400).json({ message: "Alert ID is required." });
    }

    try {
        // Find the UserAlert record to ensure it exists before updating
        const userAlert = await UserAlerts.findOne({
            where: {
                id_user: userId,
                id_alert: alert_id
            }
        });

        if (!userAlert) {
            return res.status(404).json({ message: "UserAlert not found." });
        }

        // Update the readed column
        userAlert.readed = !userAlert.readed; // Toggle the value
        await userAlert.save();

        return res.status(200).json({
            message: "Alert read status updated successfully.",
            alert_id: alert_id,
            readed: userAlert.readed
        });
    } catch (error) {
        console.error("Error updating alert read status:", error);
        res.status(500).json({
            message: "Error updating alert read status.",
            error: error.message
        });
    }
};

const updateAllAlertsReadStatus = async (req, res) => {
    const userId = req.user.id_user; // Extract user ID from the authenticated request token

    try {
        // Start a transaction
        const result = await UserAlerts.sequelize.transaction(async (transaction) => {
            // Retrieve all alerts for the user
            const userAlerts = await UserAlerts.findAll({
                where: { id_user: userId },
                transaction,
            });

            if (!userAlerts || userAlerts.length === 0) {
                return res.status(404).json({ message: "No alerts found for the user." });
            }

            await UserAlerts.update(
                { readed: true },
                { where: { id_user: userId }, transaction }
            );

            return true; // Return the new status
        });

        res.status(200).json({
            message: "All alerts read status updated successfully.",
            readed: result, // The new read status for all alerts
        });
    } catch (error) {
        console.error("Error updating all alert read statuses:", error);
        res.status(500).json({
            message: "Error updating all alert read statuses.",
            error: error.message,
        });
    }
};

module.exports = { updateAllAlertsReadStatus, updateAlertReadStatus, getAlertsWithReadedCount, createAlert, getUserAlerts };
