// App.js
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { Line } from 'react-chartjs-2';

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Login component (same as before)
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

// Dashboard component
function Dashboard({ username, emergencyContact, onAddContactClick }) {
  const [position, setPosition] = useState(null);

  // Sample chart data
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

  // Get user location via GPS
  useEffect(() => {
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

  // Google Maps Embed URL with coordinates
  const googleMapsUrl = position
    ? `https://maps.google.com/maps?q=${position[0]},${position[1]}&z=15&output=embed`
    : null;

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
        <h3>Emergency Contact</h3>
        {emergencyContact ? (
          <div style={{ marginBottom: 10 }}>
            <strong>Name:</strong> {emergencyContact.name} <br />
            <strong>Phone/Email:</strong> {emergencyContact.contact}
          </div>
        ) : (
          <p>No emergency contact added yet.</p>
        )}
        <button onClick={onAddContactClick} style={styles.button}>
          {emergencyContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
        </button>
      </section>

      {/* Google Map */}
      <section style={{ marginTop: 40 }}>
        <h3>Your Current Location</h3>
        {position ? (
          <iframe
            title="google-map"
            src={googleMapsUrl}
            width="100%"
            height="300"
            style={{ border: 0, maxWidth: 700 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : (
          <p>Loading location...</p>
        )}
      </section>
    </div>
  );
}

// Emergency Contact Form
function EmergencyContactForm({ emergencyContact, onSaveContact }) {
  const [name, setName] = useState(emergencyContact?.name || '');
  const [contact, setContact] = useState(emergencyContact?.contact || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setError('Please fill in all fields');
      return;
    }
    onSaveContact({ name: name.trim(), contact: contact.trim() });
    navigate('/dashboard');
  };

  return (
    <div style={styles.background}>
      <div style={styles.formContainer}>
        <h2 style={{ textAlign: 'center' }}>Emergency Contact</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ marginBottom: 15 }}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label>Phone or Email:</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Save Contact
          </button>
        </form>
      </div>
    </div>
  );
}

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={setUser} />}
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                username={user}
                emergencyContact={emergencyContact}
                onAddContactClick={() => window.history.pushState({}, '', '/emergency-contact')}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/emergency-contact"
          element={
            user ? (
              <EmergencyContactForm
                emergencyContact={emergencyContact}
                onSaveContact={setEmergencyContact}
              />
            ) : (
              <Navigate to="/" />
            )
          }
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
    backgroundColor: 'rgba(255,255,255,0.95)',
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
