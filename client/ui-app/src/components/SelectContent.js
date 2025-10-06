import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
// import MuiListItemAvatar from '@mui/material/ListItemAvatar';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListSubheader from '@mui/material/ListSubheader';
// import Select, { selectClasses } from '@mui/material/Select';
// import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
// import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
// import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
// import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import MI from '../assets/Mi.png';
// const Avatar = styled(MuiAvatar)(({ theme }) => ({
//   width: 40,
//   height: 40,
//   border: `1px solid ${(theme.vars || theme).palette.divider}`,
// }));

// const ListItemAvatar = styled(MuiListItemAvatar)({
//   minWidth: 0,
//   marginRight: 12,
// });

export default function SelectContent() {
  // const [company, setCompany] = React.useState('');

  // const handleChange = (event) => {
  //   setCompany(event.target.value);
  // };

  return (


    // <Select
    //   labelId="company-select"
    //   id="company-simple-select"
    //   value={company}
    //   onChange={handleChange}
    //   displayEmpty
    //   inputProps={{ 'aria-label': 'Select company' }}
    //   fullWidth
    //   sx={{
    //     maxHeight: 56,
    //     width: 215,
    //     '&.MuiList-root': {
    //       p: '8px',
    //     },
    //     [`& .${selectClasses.select}`]: {
    //       display: 'flex',
    //       alignItems: 'center',
    //       gap: '2px',
    //       pl: 1,
    //     },
    //   }}
    // >
    //   <ListSubheader sx={{ pt: 0 }}>Production</ListSubheader>
    //   <MenuItem value="">
    //     <ListItemAvatar>
    //       <Avatar alt="Sitemark web">
    //         <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
    //       </Avatar>
    //     </ListItemAvatar>
    //     <ListItemText primary="Sitemark-web" secondary="Web app" />
    //   </MenuItem>
    //   <MenuItem value={10}>
    //     <ListItemAvatar>
    //       <Avatar alt="Sitemark App">
    //         <SmartphoneRoundedIcon sx={{ fontSize: '1rem' }} />
    //       </Avatar>
    //     </ListItemAvatar>
    //     <ListItemText primary="Sitemark-app" secondary="Mobile application" />
    //   </MenuItem>
    //   <MenuItem value={20}>
    //     <ListItemAvatar>
    //       <Avatar alt="Sitemark Store">
    //         <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
    //       </Avatar>
    //     </ListItemAvatar>
    //     <ListItemText primary="Sitemark-Store" secondary="Web app" />
    //   </MenuItem>
    //   <ListSubheader>Development</ListSubheader>
    //   <MenuItem value={30}>
    //     <ListItemAvatar>
    //       <Avatar alt="Sitemark Admin">
    //         <ConstructionRoundedIcon sx={{ fontSize: '1rem' }} />
    //       </Avatar>
    //     </ListItemAvatar>
    //     <ListItemText primary="Sitemark-Admin" secondary="Web app" />
    //   </MenuItem>
    //   <Divider sx={{ mx: -1 }} />
    //   <MenuItem value={40}>
    //     <ListItemIcon>
    //       <AddRoundedIcon />
    //     </ListItemIcon>
    //     <ListItemText primary="Add product" secondary="Web app" />
    //   </MenuItem>
    // </Select>

   <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: '1.8rem',
    color: '#ea6d11',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
  }}
>
  <img
    src={MI}
    alt="Logo"
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',       
      objectFit: 'cover',       
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)', 
    }}
  />

  {/* Text */}
  <span>
    Mass<span style={{ color: '#ff9c3b' }}>click</span>
  </span>
</div>


  );
}
