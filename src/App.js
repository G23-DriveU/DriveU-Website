import './styles/App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Driver from './pages/Driver';
import Rider from './pages/Rider';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import EditProfile from './pages/Signup';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Profile from './pages/Profile';
import PastTrips from './pages/PastTrips';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
          <ThemeProvider theme={theme}>
            <Navbar />
          </ThemeProvider>

          <div className="page-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/driver" element={<Driver />} />
              <Route path="/rider" element={<Rider />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* <Route path="/editprofile" element={<EditProfile />} /> */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/pasttrips" element={<PastTrips />} />
            </Routes>
          </div>
      </div>
    </Router>
  );
}

export default App;
