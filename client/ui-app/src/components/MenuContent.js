import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import { Typography, Box } from '@mui/material';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon sx={{ fontSize: 38 }} />, path: '/dashboard' },
  { text: 'Category', icon: <CategoryIcon sx={{ fontSize: 38 }} />, path: '/dashboard/category' },
  { text: 'Location', icon: <LocationOnIcon sx={{ fontSize: 38 }} />, path: '/dashboard/location' },
  { text: 'Business', icon: <BusinessIcon sx={{ fontSize: 38 }} />, path: '/dashboard/business' },
  { text: 'Clients', icon: <SupportAgentIcon sx={{ fontSize: 38 }} />, path: '/dashboard/clients' },
  { text: 'Users', icon: <InterpreterModeIcon sx={{ fontSize: 38 }} />, path: '/dashboard/user' },
  { text: 'Role', icon: <AdminPanelSettingsIcon sx={{ fontSize: 38 }} />, path: '/dashboard/roles' },
];

export default function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => {
          const selected = location.pathname === item.path;

          return (
            <ListItem key={index} disablePadding sx={{ display: 'block', mb: 1 }}>
              <ListItemButton
                selected={selected}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: selected ? '#FF8C42' : 'transparent',
                  '&:hover': {
                    backgroundColor: selected ? '#FF8C42' : '#FFE0B2',
                  },
                  color: selected ? '#fff' : '#333',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selected ? '#fff' : '#ea6d11',
                    minWidth: '40px',
                  }}
                >
                  <Box sx={{ fontSize: 38 }}>
                    {item.icon}
                  </Box>
                </ListItemIcon>

                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold', 
                    color: selected ? '#FF8C42' : '#333'
                  }}
                >
                  {item.text}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}
