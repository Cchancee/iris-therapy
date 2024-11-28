import * as React from 'react';
import { useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useNavigate } from 'react-router-dom'; 
import Logo from '../../assets/logo-transp.png';

// MUI Components for responsive menu
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail'; // Messages Icon
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { FaCalendarAlt } from "react-icons/fa";
import GroupIcon from '@mui/icons-material/Group';
import SupportIcon from '@mui/icons-material/HelpOutline';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#dce2f3',
  boxShadow: 'none',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': {
            ...openedMixin(theme),
          },
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': {
            ...closedMixin(theme),
          },
        },
      },
    ],
  }),
);

export default function MiniDrawer() {
  const navigate = useNavigate(); // Initialize navigate function
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null); // For the dropdown menu
  const isMenuOpen = Boolean(menuAnchorEl);
  const [iconsMenuAnchorEl, setIconsMenuAnchorEl] = useState(null); // For icons menu
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // get userdata from local storage
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const Userusername = userData.username;
  const Useremail = userData.email;


  // Function to handle the change in screen size
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 960); // Adjust the width as per your requirement
  };
  
    // UseEffect to add event listener for resizing
    useEffect(() => {
      // Initial check
      handleResize();
  
      // Add event listener for window resizing
      window.addEventListener('resize', handleResize);
  
      // Cleanup event listener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    // Close the icons menu when the screen becomes large
    useEffect(() => {
      if (!isSmallScreen) {
        setIconsMenuAnchorEl(null); // Close the menu when switching to a larger screen
      }
    }, [isSmallScreen]);

    // Close the icons menu when the screen becomes large
    useEffect(() => {
      if (isSmallScreen) {
        setMenuAnchorEl(null); // Close the menu when switching to a larger screen
      }
    }, [isSmallScreen]);



  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Handle opening and closing of the account menu
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
    setIconsMenuAnchorEl(null); // Close the icons menu if it's open
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle opening and closing of the icons menu
  const handleIconsMenuOpen = (event) => {
    setIconsMenuAnchorEl(event.currentTarget);
    setMenuAnchorEl(null); // Close the account menu if it's open
  };

  const handleIconsMenuClose = () => {
    setIconsMenuAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('publicToken')
    localStorage.removeItem('userData')
    navigate('/signin')
  }

  const pages = [
    { name: 'Dashboard', path: '/therapist', icon: <DashboardIcon /> },
    { name: 'Manage Sessions', path: 'sessions', icon: <FaCalendarAlt /> },
    { name: 'Patient List', path: 'patients', icon: <GroupIcon /> },
    { name: 'Session History', path: 'session-history', icon: <HistoryIcon /> },
    { name: 'Support', path: 'support', icon: <SupportIcon /> },
  ];
  

  // Base path for the sidebar (e.g., '/admin')
  const basePath = '/therapist';

  // Function to check if the current path is active
  const isActive = (path) => {
    // For relative paths, prepend the base path
    const fullPath = path.startsWith('/') ? path : `${basePath}/${path}`;
    return location.pathname === fullPath; // Exact match for the full path
  };

   

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#000', display: { xs: open ? 'none' : 'block', sm: 'block' } }}>
            Therapist
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* Icons hidden on small screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex', backgroundColor: '#fff', borderRadius: 30, paddingInline: 10, paddingBlock: 2, marginRight: 10 } }}>
            <IconButton aria-label="messages" sx={{ color: '#5C6BC0', mx: 1 }}>
              <MailIcon />
            </IconButton>
            <IconButton aria-label="notifications" sx={{ color: '#1976D2', mx: 1 }}>
              <NotificationsIcon />
            </IconButton>
            {/* Account Icon with Dropdown Menu */}
            <IconButton
              aria-label="user"
              sx={{ color: '#8FA5FF', mx: 1 }}
              onClick={handleMenuOpen} // Open the account menu on click
            >
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" className='max-w-[20px] max-h-[20px]' />
            </IconButton>
          </Box>

          {/* Dropdown menu for small screens */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleIconsMenuOpen} // Open the icons menu on click
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={iconsMenuAnchorEl} // Use iconsMenuAnchorEl here
              open={Boolean(iconsMenuAnchorEl)} // Open when the anchor is set
              onClose={handleIconsMenuClose} // Handle closing the icons menu
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleIconsMenuClose}>Messages</MenuItem>
              <MenuItem onClick={handleIconsMenuClose}>Notifications</MenuItem>
              <MenuItem onClick={handleIconsMenuClose}>Profile</MenuItem>
            </Menu>
          </Box>

          {/* Account Menu for Profile, Settings, and Logout */}
          <Menu
            id="account-menu"
            anchorEl={menuAnchorEl} // Use menuAnchorEl here
            open={Boolean(menuAnchorEl)} // Open when the anchor is set
            onClose={handleMenuClose} // Handle closing the account menu
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          backgroundColor: '#dce2f3',
          zIndex: 100,
          position: { xs: open ? 'fixed' : 'relative', sm: 'relative' },
          isolation: 'isolate',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // Ensures items are spaced properly
        }}
      >
        {/* Header Section */}
        <DrawerHeader
          sx={{
            backgroundColor: '#fff',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div></div>
          <img src={Logo} alt="Logo" style={{ width: '50px', height: '50px' }} />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {/* Main List Section */}
        <List>
          {pages.map(({ name, path, icon }) => (
            <ListItem key={name} disablePadding sx={{ display: 'block', color: '#333' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  px: { xs: open ? 'auto' : 1, md: open ? 4 : 'auto' },
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: open ? '#dce2f3' : 'white',
                    borderRight: open ? '5px solid #8FA5FF' : 'none',
                    '& .MuiListItemIcon-root': {
                      backgroundColor: '#8FA5FF',
                      color: '#fff',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#222',
                    },
                  },
                  backgroundColor: isActive(path) ? '#dce2f3' : 'transparent',
                  borderRight: isActive(path) ? '5px solid #8FA5FF' : 'none',
                }}
                component={Link}
                to={path.startsWith('/') ? path : `${basePath}/${path}`}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      backgroundColor: isActive(path) ? '#8FA5FF' : '#fff',
                      color: isActive(path) ? '#fff' : '#333',
                      p: '5px',
                      fontSize: '20px',
                      borderRadius: '5px',
                      transition: 'all 0.3s',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          m: 'auto',
                        },
                  ]}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={name}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: 'opacity 0.3s',
                    color: '#333',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Footer Section */}
        <Box
          sx={{
            textAlign: 'center',
            p: 2,
            borderTop: '1px solid #ccc',
            mt: 'auto', // Push to the bottom
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              opacity: open ? 1 : 0,
              transition: 'opacity 0.3s',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            {Userusername}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              opacity: open ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          >
            {Useremail}
          </Typography>
        </Box>
      </Drawer>

    </Box>


  );
}
