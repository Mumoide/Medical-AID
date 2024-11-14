const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('NewsletterSubscribers', {
    id_subscriber: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "newslettersubscribers_email_unique"
    },
    subscribed_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    unsubscribed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'NewsletterSubscribers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "NewsletterSubscribers_pkey",
        unique: true,
        fields: [
          { name: "id_subscriber" },
        ]
      },
      {
        name: "newslettersubscribers_email_unique",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
