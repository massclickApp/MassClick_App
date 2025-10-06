import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllLocation,
    createLocation,
    editLocation,
    deleteLocation,
} from "../../redux/actions/locationAction.js";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

export default function Location() {
    const dispatch = useDispatch();
    const { location = [], loading, error } = useSelector(
        (state) => state.locationReducer || {}
    );
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        country: "",
        state: "",
        district: "",
        city: "",
        pincode: "",
        addressLine1: "",
        addressLine2: "",
    });

    const [editingId, setEditingId] = useState(null);

    // 🔹 State for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        dispatch(getAllLocation());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const validateForm = () => {
        let newErrors = {};

        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.district.trim()) newErrors.district = "District is required";
        if (!formData.city.trim()) newErrors.city = "City is required";

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{5,6}$/.test(formData.pincode)) {
            newErrors.pincode = "Invalid pincode format";
        }

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = "Address Line 1 is required";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const resetForm = () => {
        setFormData({
            country: "",
            state: "",
            district: "",
            city: "",
            pincode: "",
            addressLine1: "",
            addressLine2: "",
        });
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (editingId) {
            dispatch(editLocation(editingId, formData))
                .then(() => {
                    resetForm();
                    dispatch(getAllLocation());
                })
                .catch((err) => console.error("Update location failed:", err));
        } else {
            dispatch(createLocation(formData))
                .then(() => {
                    resetForm();
                    dispatch(getAllLocation());
                })
                .catch((err) => console.error("Create location failed:", err));
        }
    };

    const handleEdit = (row) => {
        setEditingId(row.id);
        setFormData({
            country: row.country || "",
            state: row.state || "",
            district: row.district || "",
            city: row.city || "",
            pincode: row.pincode || "",
            addressLine1: row.addressLine1 || "",
            addressLine2: row.addressLine2 || "",
        });
    };

    const handleDeleteClick = (row) => {
        setSelectedRow(row);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {debugger
    if (selectedRow?.id) { 
            dispatch(deleteLocation(selectedRow.id))
                .then(() => {
                    dispatch(getAllLocation());
                    setDeleteDialogOpen(false);
                    setSelectedRow(null);
                })
                .catch((err) => console.error("Delete location failed:", err));
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedRow(null);
    };

    const rows = location
  .filter((loc) => loc.isActive) 

        .map((loc, index) => ({
            id: loc._id || index,
            country: loc.country,
            state: loc.state,
            district: loc.district,
            city: loc.city,
            pincode: loc.pincode || "-",
            addressLine1: loc.addressLine1 || "-",
            addressLine2: loc.addressLine2 || "-",
            isActive: loc.isActive,

        }));

    const locationList = [
        { field: "country", headerName: "Country", flex: 1 },
        { field: "state", headerName: "State", flex: 1 },
        { field: "district", headerName: "District", flex: 1 },
        { field: "city", headerName: "City", flex: 1 },
        { field: "pincode", headerName: "Pincode", flex: 1 },
        { field: "addressLine1", headerName: "AddressLine1", flex: 1 },
        { field: "addressLine2", headerName: "AddressLine2", flex: 1 },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(params.row)}
                    >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const fields = [
        { label: "Country", name: "country", required: true, type: "text" },
        { label: "State", name: "state", required: true, type: "text" },
        { label: "District", name: "district", required: true, type: "text" },
        { label: "City", name: "city", required: true, type: "text" },
        { label: "PinCode", name: "pincode", required: true, type: "text" },
        { label: "AddressLine1", name: "addressLine1", required: true, type: "text" },
        { label: "AddressLine2", name: "addressLine2", required: true, type: "text" },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {editingId ? "Edit Location" : "Add New Location"}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {fields.map((field, i) => (
                            <Grid item xs={12} key={i}>
                                <TextField
                                    fullWidth
                                    type={field.type}
                                    label={field.label}
                                    name={field.name}
                                    variant="standard"
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    error={Boolean(errors[field.name])}
                                    helperText={errors[field.name] || ""}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            height: 50,
                                            fontSize: "1.1rem",
                                        },
                                        "& .MuiInputLabel-root": {
                                            fontSize: "1rem",
                                        },
                                    }}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    justifyContent: { xs: "flex-end", sm: "flex-start" },
                                    mt: 4,
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ minWidth: 150 }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : editingId ? (
                                        "Update Location"
                                    ) : (
                                        "Create Location"
                                    )}
                                </Button>
                                {editingId && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {typeof error === "string"
                            ? error
                            : error.message || JSON.stringify(error)}
                    </Typography>
                )}
            </Paper>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Location Table
                </Typography>
                <Box sx={{ height: 500, width: "100%" }}>
                    <CustomizedDataGrid rows={rows} columns={locationList} />
                </Box>
            </Paper>

            {/* 🔹 Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete{" "}
                    <strong>{selectedRow?.city || "this location"}</strong>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
