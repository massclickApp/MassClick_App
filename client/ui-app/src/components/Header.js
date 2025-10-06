import React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from '../components/customDatePicker';
import NavbarBreadcrumbs from './NavbarBreadCrump.js';
import MenuButton from './MenuButton';
// import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import Search from './Search';
import OptionsMenu from './OptionsMenu.js';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      {/* Left: Breadcrumbs */}
      <NavbarBreadcrumbs />

      {/* Right: Actions */}
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <CustomDatePicker />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <OptionsMenu />
      </Stack>
    </Stack>
  );
}
