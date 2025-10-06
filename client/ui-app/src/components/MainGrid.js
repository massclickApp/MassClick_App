import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Typography, Button } from '@mui/material';
// import ChartUserByCountry from './ChartUserByCountry';
import CustomizedDataGrid from './CustomizedDataGrid';
// import PageViewsBarChart from './PageViewsBaChart.js';
// import SessionsChart from './SessionsChart';
// import StatCard, { StatCardProps } from './StatCard';
import { useSelector, useDispatch } from "react-redux";
import { getAllBusinessList, toggleBusinessStatus } from "../redux/actions/businessListAction"; // your thunk/action
import { useSnackbar } from 'notistack';

import {
  Paper,
  Avatar,

} from "@mui/material";

import BusinessCard from './businessCard';

export default function MainGrid() {
  const { enqueueSnackbar } = useSnackbar();

  const { businessList = [] } = useSelector(
    (state) => state.businessListReducer || {}
  );
  const [activeStatus, setActiveStatus] = React.useState(
    businessList.reduce((acc, b) => {
      acc[b._id] = b.isActive;
      return acc;
    }, {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBusinessList());
  }, [dispatch]);

  const rows = businessList.map((bl) => ({
    _id: bl._id,
    id: bl._id,
    clientId: bl.clientId || "-",
    businessName: bl.businessName || "-",
    plotNumber: bl.plotNumber || "-",
    street: bl.street || "-",
    pincode: bl.pincode || "-",
    email: bl.email || "-",
    contact: bl.contact || "-",
    contactList: bl.contactList || "-",
    gstin: bl.gstin || "-",
    whatsappNumber: bl.whatsappNumber || "-",
    experience: bl.experience || "-",
    location: bl.location || "-",
    category: bl.category || "-",
    bannerImage: bl.bannerImage || null,
    googleMap: bl.googleMap || "-",
    website: bl.website || "-",
    facebook: bl.facebook || "-",
    instagram: bl.instagram || "-",
    youtube: bl.youtube || "-",
    pinterest: bl.pinterest || "-",
    twitter: bl.twitter || "-",
    linkedin: bl.linkedin || "-",
    businessDetails: bl.businessDetails || "-",
    activeBusinesses: bl.activeBusinesses,
  }));



  const businessListTable = [
    { field: "clientId", headerName: "ClientId", flex: 1 },
    {
      field: "bannerImage",
      headerName: "Banner Image",
      flex: 1,
      renderCell: (params) =>
        params.value ? <Avatar src={params.value} alt="img" /> : "-",
    },
    { field: "businessName", headerName: "Business Name", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const isActive = activeStatus[params.row._id] ?? params.row.activeBusinesses;
        const businessName = params.row.businessName;

        const handleClick = async () => {
          const newStatus = !isActive;
          setActiveStatus(prev => ({ ...prev, [params.row._id]: newStatus }));

          try {
            await dispatch(toggleBusinessStatus({ id: params.row._id, newStatus }));

            if (newStatus) {
              enqueueSnackbar(`${businessName} is now Active!`, { variant: 'success' });
            } else {
              enqueueSnackbar(`${businessName} is now Inactive!`, { variant: 'error' });
            }

          } catch (err) {
            setActiveStatus(prev => ({ ...prev, [params.row._id]: isActive }));
            enqueueSnackbar('Failed to update status.', { variant: 'error' });
            console.error(err);
          }
        };

        return (
          <Button
            onClick={handleClick}
            sx={{
              minWidth: 80,
              px: 1.5,
              py: 0.5,
              borderRadius: 20,
              fontWeight: 600,
              fontSize: "0.8rem",
              color: "#fff",
              textTransform: "none",
              boxShadow: isActive
                ? "0 2px 6px rgba(76, 175, 80, 0.4)"
                : "0 2px 6px rgba(244, 67, 54, 0.4)",
              background: isActive
                ? "linear-gradient(135deg, #4caf50, #388e3c)"
                : "linear-gradient(135deg, #ef5350, #c62828)",
              transition: "all 0.3s ease",
              '&:hover': {
                background: isActive
                  ? "linear-gradient(135deg, #66bb6a, #2e7d32)"
                  : "linear-gradient(135deg, #ef5350, #b71c1c)",
                boxShadow: isActive
                  ? "0 4px 12px rgba(76, 175, 80, 0.6)"
                  : "0 4px 12px rgba(244, 67, 54, 0.6)",
              },
            }}
          >
            {isActive ? "Active" : "Inactive"}
          </Button>
        );
      },
    }





  ];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Overview cards */}

      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>



        <Grid xs={12} md={6}>
          <BusinessCard />
        </Grid>
      </Grid>


      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          BusinessList Table
        </Typography>
        <Box sx={{ height: 500, width: "100%" }}>
          <CustomizedDataGrid rows={rows} columns={businessListTable} />
        </Box>
      </Paper>
      {/* Footer */}
    </Box>
  );
}
