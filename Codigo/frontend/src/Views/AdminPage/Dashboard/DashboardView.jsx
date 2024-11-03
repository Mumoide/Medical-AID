import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardView.css"; // You can style your component here

const DashboardView = () => {
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API endpoint
  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/dashboard/all"
        );
        console.log(response.data);
        setDiagnosisData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchDiagnosisData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-container">
      <h1>Diagnosis Dashboard</h1>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>ID Diagnosis</th>
            <th>User ID</th>
            <th>Diagnosis Date</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Probability</th>
            <th>Disease Name</th>
            <th>Symptoms</th>
          </tr>
        </thead>
        <tbody>
          {diagnosisData.map((diagnosis, index) => (
            <tr key={index}>
              <td>{diagnosis.id_diagnosis}</td>
              <td>{diagnosis.id_user}</td>
              <td>{new Date(diagnosis.diagnosis_date).toLocaleString()}</td>
              <td>{diagnosis.latitude}</td>
              <td>{diagnosis.longitude}</td>
              <td>{diagnosis.probability.toFixed(2)}%</td>
              <td>
                {diagnosis.diseases && diagnosis.diseases.length > 0
                  ? diagnosis.diseases
                      .map((disease) => disease.disease_name)
                      .join(", ")
                  : "No disease recorded"}
              </td>
              <td>
                {diagnosis.symptoms
                  .map((symptom) => symptom.symptom_name)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardView;
