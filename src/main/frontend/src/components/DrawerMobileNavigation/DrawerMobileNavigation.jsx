import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Drawer from '@mui/joy/Drawer';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Menu from '@mui/icons-material/Menu';
import './DrawerMobileNavigation.css';

export default function DrawerMobileNavigation() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <IconButton
        className="drawer-icon-button"
        variant="outlined"
        color="neutral"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </IconButton>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          content: {
            sx: {
              width: 220,
              height: 'auto',
              maxHeight: 360,
              boxShadow: 'lg',
              borderRadius: 20,
              mt: '20vh',
            },
          },
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              alignItems: 'flex-start',
              justifyContent: 'center',
            },
          },
        }}
      >
        <Box className="drawer-container">
          <List className="drawer-nav-list" size="lg" component="nav">
            <ListItemButton
              onClick={() => handleNavigation('/dashboard')}
              sx={listItemStyles}
            >
              Home
            </ListItemButton>
            <ListItemButton
              onClick={() => handleNavigation('/product')}
              sx={listItemStyles}
            >
              Add Item
            </ListItemButton>
            <ListItemButton
              onClick={() => handleNavigation('/edit-user')}
              sx={listItemStyles}
            >
              Profile Settings
            </ListItemButton>
                    <ListItemButton
          onClick={() => {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("selectedProductId");
            handleNavigation('/signup'); 
          }}
          sx={listItemStyles}
        >
          Log Out
        </ListItemButton>

          </List>
        </Box>
      </Drawer>
    </>
  );
}

const listItemStyles = {
  
  color: 'white',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  borderRadius: '12px',
  padding: '14px 18px',
  textAlign: 'left',
  boxShadow: '0 2px 6px rgba(0, 188, 212, 0.25)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'white',
    transform: 'translateX(6px)',
    boxShadow: '0 4px 12px rgba(0, 105, 180, 0.4)',
  },
};
