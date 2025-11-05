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
import { getAllLocation } from "../redux/actions/locationAction";
import { getAllUsers } from "../redux/actions/userAction.js";

import {
  Paper,
  Avatar,

} from "@mui/material";

import BusinessCard from './businessCard';
import ChartUserByBusiness from './ChartUserByCountry';
import CustomizedTable from './Table/CustomizedTable.js';

export default function MainGrid() {
  const { enqueueSnackbar } = useSnackbar();
  const { users = [] } = useSelector((state) => state.userReducer || {});
  const { businessList = [] } = useSelector(
    (state) => state.businessListReducer || {}
  );
  const [activeStatus, setActiveStatus] = React.useState(
    businessList.reduce((acc, b) => {
      acc[b._id] = b.isActive;
      return acc;
    }, {})
  );
  const { location = [] } = useSelector((state) => state.locationReducer || {});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBusinessList());
    dispatch(getAllLocation());
    dispatch(getAllUsers());
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
    createdBy: bl.createdBy,
  }));



  const businessListTable = [
    { id: "clientId", label: "Client ID" },
    {
      id: "bannerImage",
      label: "Banner Image",
      renderCell: (value) => (value ? <Avatar src={value} alt="img" /> : "-"),
    },
    { id: "businessName", label: "Business Name" },
    { id: "location", label: "Location Name" },
    { id: "category", label: "Category" },
    {
      id: "createdBy",
      label: "Created By",
      renderCell: (value) => {
        if (!value) return "—";

        const createdById =
          typeof value === "object" && value.$oid ? value.$oid : value;
        const user = users.find((u) => {
          const userId =
            typeof u._id === "object" && u._id.$oid ? u._id.$oid : u._id;
          return userId === createdById;
        });

        return user ? user.userName : "—";
      },
    },
    {
      id: "isActive",
      label: "Status",
      renderCell: (_, row) => {
        const isActive = activeStatus[row._id] ?? row.activeBusinesses;
        const businessName = row.businessName;

        const handleClick = async () => {
          const newStatus = !isActive;
          setActiveStatus((prev) => ({ ...prev, [row._id]: newStatus }));

          try {
            await dispatch(toggleBusinessStatus({ id: row._id, newStatus }));
            enqueueSnackbar(
              `${businessName} is now ${newStatus ? "Active" : "Inactive"}!`,
              { variant: newStatus ? "success" : "error" }
            );
          } catch (err) {
            setActiveStatus((prev) => ({ ...prev, [row._id]: isActive }));
            enqueueSnackbar("Failed to update status.", { variant: "error" });
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
              background: isActive
                ? "linear-gradient(135deg, #4caf50, #388e3c)"
                : "linear-gradient(135deg, #ef5350, #c62828)",
              '&:hover': {
                background: isActive
                  ? "linear-gradient(135deg, #66bb6a, #2e7d32)"
                  : "linear-gradient(135deg, #ef5350, #b71c1c)",
              },
            }}
          >
            {isActive ? "Active" : "Inactive"}
          </Button>
        );
      },
    },
  ];


  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Overview cards */}

      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>



        <Grid xs={12} md={6}>
          <BusinessCard />
        </Grid>
      </Grid>

      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid item xs={12} md={12}>
          <ChartUserByBusiness />
        </Grid>
      </Grid><br />
      <Grid elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          BusinessList Table
        </Typography>
        <Box sx={{ width: "100%" }}>
          <CustomizedTable data={rows} columns={businessListTable} />
        </Box>
      </Grid>
      {/* Footer */}
    </Box>
  );
}
