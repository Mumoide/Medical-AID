import React, { useEffect, useRef } from "react";
import "./AlertList.css";

function formatDateDifference(createdAt) {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDifference = currentDate - createdDate;

  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (hoursDifference < 24) {
    return `Hace ${hoursDifference} hora${hoursDifference !== 1 ? "s" : ""}`;
  } else {
    return `Hace ${daysDifference} día${daysDifference !== 1 ? "s" : ""}`;
  }
}

function AlertList({ alertsData, onClose }) {
  const alertListRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        alertListRef.current &&
        !alertListRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const latestAlerts = alertsData.slice(0, 5);

  return (
    <div className="alert-list-overlay">
      <div className="alert-list" ref={alertListRef}>
        <div className="alert-list-title">
          <h3>Alertas</h3>
        </div>
        {latestAlerts.length === 0 ? (
          <p>No hay alertas nuevas</p>
        ) : (
          <ul>
            {latestAlerts.map((alert, index) => (
              <li key={index} className="alert-item">
                <p className="alert-item-message">
                  Se ha detectado una emergencia de severidad{" "}
                  <strong>{alert.alert_type}</strong> en la región{" "}
                  <strong>{alert.region}</strong>.
                </p>
                <p className="alert-item-time">
                  {formatDateDifference(alert.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default AlertList;
