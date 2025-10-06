import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import StoreIcon from "@mui/icons-material/Store";
import { getAllBusinessList } from "../redux/actions/businessListAction";
import { useDispatch, useSelector } from "react-redux";



function SelectActionCard() {
  const dispatch = useDispatch();

  const { businessList = [] } = useSelector(
    (state) => state.businessListReducer || {}
  );

  useEffect(() => {
    dispatch(getAllBusinessList());
  }, [dispatch]);

  const safeBusinessList = Array.isArray(businessList) ? businessList : [];

  const todayBusinessesCount = safeBusinessList.filter(b => {
    const created = new Date(b.createdAt);
    const today = new Date();
    return (
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear()
    );
  }).length;

  const totalBusinessesCount = safeBusinessList.length;

  const activeBusinessesCount = safeBusinessList.filter(
    b => b.activeBusinesses === true
  ).length;

  const cards = [
    {
      id: 1,
      title: "Today Business",
      value: todayBusinessesCount,
      label: "Business",
      icon: <BusinessCenterIcon sx={{ fontSize: 35, color: "#f57c00" }} />,
    },
    {
      id: 2,
      title: "Total Businesses",
      value: totalBusinessesCount,
      label: "Business",
      icon: <StoreIcon sx={{ fontSize: 35, color: "#f57c00" }} />,
    },
    {
      id: 3,
      title: "Active Businesses",
      value: activeBusinessesCount,
      label: "Business",
      icon: <ShoppingCartIcon sx={{ fontSize: 35, color: "#f57c00" }} />,
    },
    {
      id: 4,
      title: "Total Customers",
      value: activeBusinessesCount,
      label: "Customers",
      icon: <PeopleIcon sx={{ fontSize: 35, color: "#f57c00" }} />,
    }
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gap: 7,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          elevation={3}
          sx={{
            borderRadius: 3,
            width: { xs: "100%", sm: 300, md: 350 },
            height: { xs: 160, sm: 180, md: 200 },
            margin: "auto",
            transition: "all 0.3s ease-in-out",
            boxShadow: "5px 5px 15px rgba(0,0,0,0.1)",
            "&:hover": {
              transform: "translateY(-8px)", // lift on hover
              boxShadow: "8px 12px 20px rgba(0,0,0,0.2)",
            },
          }}
        >

          <CardContent>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "#333",
                mb: 2,
                letterSpacing: 0.5,
              }}
            >
              {card.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Box
                sx={{
                  width: 100,
                  height: 70,
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, #ececec, #ffffff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "5px 5px 15px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.6)",
                }}
              >
                {card.icon}
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#222" }}
                >
                  {typeof card.value === "number" ? card.value : 0}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#43a047" }}
                >
                  {card.label}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default SelectActionCard;
