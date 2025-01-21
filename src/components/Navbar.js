import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AppBar position="fixed"
      sx={{
        backgroundColor: 'white',
        color: 'black',
      }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#333' }}>
          DriveU
        </Typography>
        <Button color="inherit" component={Link} to="/" sx={{ color: '#333', fontWeight: 'bold', marginLeft: 2}}>Home</Button>
        <Button color="inherit" component={Link} to="/driver" sx={{ color: '#333', fontWeight: 'bold', marginLeft: 2}}>Driver</Button>
        <Button color="inherit" component={Link} to="/rider" sx={{ color: '#333', fontWeight: 'bold', marginLeft: 2}}>Rider</Button>
        {!user && <Button color="inherit" component={Link} to="/login" sx={{ color: '#333', fontWeight: 'bold', marginLeft: 2}}>Login</Button>}
        {!user && (
          <Button
            component={Link}
            to="/signup"
            sx={{
              background: 'linear-gradient(to right,rgb(222, 95, 236),rgb(241, 239, 90))',
              borderRadius: '20px',
              color: 'black',
              fontWeight: 'bold',
              padding: '10px 20px',
              marginLeft: 2,
              '&:hover': {
                background: 'linear-gradient(to right,rgb(210, 67, 223),rgb(250, 242, 131))',
              },
            }}
          >
            Sign Up Today!
          </Button>
        )}
        {user && <Button color="inherit" component={Link} to="/editprofile" sx={{ color: '#333', fontWeight: 'bold', marginLeft: 2 }}>Edit Profile</Button>}
        {user && <Button color="inherit" onClick={handleLogout} sx={{ color: '#333', fontWeight: 'bold', marginLeft: 2 }}>Logout</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;