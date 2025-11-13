// Header.js
import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CustomDatePicker from "../components/customDatePicker";
import NavbarBreadcrumbs from "./NavbarBreadCrump.js";
import MenuButton from "./MenuButton";
import OptionsMenu from "./OptionsMenu.js";
import NotificationModal from "./notificationModel.js";

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: { xs: "none", md: "flex" },
          width: "100%",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          maxWidth: { sm: "100%", md: "1700px" },
          pt: 1.5,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />

        <Stack direction="row" sx={{ gap: 1 }}>
          <CustomDatePicker />
          <MenuButton showBadge aria-label="Open notifications" onClick={handleOpen}>
            <NotificationsRoundedIcon />
          </MenuButton>
          <OptionsMenu />
        </Stack>
      </Stack>

      <NotificationModal open={open} handleClose={handleClose} />
    </>
  );
}
