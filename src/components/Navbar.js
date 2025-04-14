import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { useProfile } from '../context/ProfileContext';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // const [firebaseUid, setFirebaseUid] = useState(null);
  const { profilePicture } = useProfile();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setUser(currentUser);
          // setFirebaseUid(currentUser.uid);
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

  // const getProfilePictureUrl = () => {
  //   if (!firebaseUid) return 'default-profile.png';
  //   return `${process.env.REACT_APP_BACKEND_URL}/uploads/${firebaseUid}.jpeg`;
  // };

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

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
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
            marginRight: 2,
          }}>DriveU</Button>
        
        <Button 
          color="inherit"
          component={Link}
          to="/driver" 
          sx={{ 
            color: '#333',
            fontWeight: 'bold',
            marginX: 2
          }}>Driver</Button>

        <Button 
          color="inherit"
          component={Link}
          to="/rider" 
          sx={{ 
            color: '#333',
            fontWeight: 'bold', 
            marginX: 2
          }}>Rider</Button>
        
        {!user && (
          <Button 
            color="inherit"
            component={Link}
            to="/login" 
            sx={{ 
              color: '#333',
              fontWeight: 'bold', 
              marginX: 2
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
              marginX: 2,
              '&:hover': {
                background: 'linear-gradient(to right,rgb(210, 67, 223),rgb(250, 242, 131))',
              },
            }}
          >
            Sign Up Today!
          </Button>
        )}
        
        {user && (
          <IconButton 
            onClick={handleMenuOpen} 
            sx={{
              marginX: 2,
              width: 40,
              height: 40,
            }}>
            <Avatar 
              alt={user.name} 
              // src={getProfilePictureUrl()}
              src={profilePicture}
              sx={{ width: 40, height: 40 }}
            >
              
            </Avatar>
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuItemClick('/profile')}>Profile</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('/pasttrips')}>Past Trips</MenuItem>
          <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;