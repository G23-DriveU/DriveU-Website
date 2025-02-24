import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

    const reloadUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      }
    };

    reloadUser();

    return () => unsubscribe();
  }, [location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed"
      sx={{
        backgroundColor: 'white',
        color: 'black',
      }}>
      <Toolbar>
        <Button 
          color="inherit"
          component={Link}
          to="/"
          sx={{ 
            fontSize: 25, 
            flexGrow: 1,
            fontWeight: 'bold',
            color: '#333',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}>DriveU</Button>
        
        <Button 
          color="inherit"
          component={Link}
          to="/driver" 
          sx={{ 
            color: '#333',
            fontWeight: 'bold', 
            marginLeft: 2
          }}>Driver</Button>

        <Button 
          color="inherit"
          component={Link}
          to="/rider" 
          sx={{ 
            color: '#333',
            fontWeight: 'bold', 
            marginLeft: 2
          }}>Rider</Button>
        
        {!user && (
          <Button 
            color="inherit"
            component={Link}
            to="/login" 
            sx={{ 
              color: '#333',
              fontWeight: 'bold', 
              marginLeft: 2
            }}>Login</Button>
        )}

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
        {/* {user && <Button color="inherit" onClick={handleLogout} sx={{ color: '#333', fontWeight: 'bold', marginLeft: 2 }}>Logout</Button>} */}
        
        {user && (
          <IconButton onClick={handleMenuOpen} sx={{ marginLeft: 2 }}>
            <Avatar alt={user.displayName} src={user.photoURL} />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
          <MenuItem onClick={() => navigate('/pasttrips')}>Past Trips</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;