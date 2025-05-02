// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue with leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(username);
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.formContainer}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ marginBottom: 15 }}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ username }) {
  const [emergencyContact, setEmergencyContact] = useState('');
  const [position, setPosition] = React.useState(null);

  // Simulated data for charts
  const sugarData = {
    labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    datasets: [
      {
        label: 'Sugar Level (mg/dL)',
        data: [90, 110, 105, 115, 100],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const heartRateData = {
    labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: [70, 75, 72, 78, 74],
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
    ],
  };

  React.useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser');
      return;
    }
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error(err);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  const handleAddContact = () => {
    if (emergencyContact.trim() !== '') {
      alert(`Emergency contact "${emergencyContact}" added!`);
      setEmergencyContact('');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>

      {/* User Info */}
      <section style={styles.userInfo}>
        <img
          src="https://i.pravatar.cc/100?img=3"
          alt="User"
          style={{ borderRadius: '50%', marginRight: 20 }}
        />
        <div>
          <h2>{username}</h2>
          <p>Welcome back!</p>
        </div>
      </section>

      {/* Charts */}
      <section style={styles.chartsContainer}>
        <div style={styles.chartBox}>
          <h3>Sugar Level</h3>
          <Line data={sugarData} />
        </div>
        <div style={styles.chartBox}>
          <h3>Heart Rate</h3>
          <Line data={heartRateData} />
        </div>
      </section>

      {/* Emergency Contact */}
      <section style={{ marginTop: 40 }}>
        <h3>Add Emergency Contact</h3>
        <input
          type="text"
          placeholder="Enter contact name or phone"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          style={{ padding: 10, width: 300, marginRight: 10 }}
        />
        <button onClick={handleAddContact} style={styles.button}>
          Add Contact
        </button>
      </section>

      {/* Map */}
      <section style={{ marginTop: 40 }}>
        <h3>Your Current Location</h3>
        {position ? (
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: 300, width: '100%', maxWidth: 700 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading location...</p>
        )}
      </section>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={setUser} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard username={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

const styles = {
  background: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage:
      "url('https://img.freepik.com/free-vector/clean-medical-patterned-background-vector_53876-161509.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 30,
    borderRadius: 8,
    width: '350px',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    backgroundColor: '#007acc',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 40,
  },
  chartsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 20,
  },
  chartBox: {
    width: '45%',
    minWidth: 300,
  },
};

export default App;
