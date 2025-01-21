import './styles/App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Driver from './pages/Driver';
import Rider from './pages/Rider';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <Router>
      <div className="App">
        
          <Navbar />
        
          
        
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/driver" element={<Driver />} />
              <Route path="/rider" element={<Rider />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/editprofile" element={<EditProfile />} />
            </Routes>
          </div>
      </div>
    </Router>
  );
}

export default App;
