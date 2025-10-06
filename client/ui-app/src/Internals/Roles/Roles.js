import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllRoles,
    createRoles,
    editRoles,
    deleteRoles,
} from "../../redux/actions/rolesAction";
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

export default function Roles() {
    const dispatch = useDispatch();
    const { roles = [], loading, error } = useSelector(
        (state) => state.rolesReducer || {}
    );
    
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        roleName: "",
        permissions: "",
        description: "",
        createdBy: "",
    });

    const [editingId, setEditingId] = useState(null);

    // 🔹 State for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        dispatch(getAllRoles());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const validateForm = () => {
        let newErrors = {};
        if (!formData.roleName.trim()) newErrors.roleName = "Role Name is required";
        if (!formData.permissions.trim()) newErrors.permissions = "Permissions are required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.createdBy.trim()) newErrors.createdBy = "Created By is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const resetForm = () => {
        setFormData({
            roleName: "",
            permissions: "",
            description: "",
            createdBy: "",
        });
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (editingId) {
            dispatch(editRoles(editingId, formData))
                .then(() => {
                    resetForm();
                    dispatch(getAllRoles());
                })
                .catch((err) => console.error("Update roles failed:", err));
        } else {
            dispatch(createRoles(formData))
                .then(() => {
                    resetForm();
                    dispatch(getAllRoles());
                })
                .catch((err) => console.error("Create roles failed:", err));
        }
    };

    const handleEdit = (row) => {
        setEditingId(row.id);
        setFormData({
            roleName: row.roleName || "",
            permissions: row.permissions || "",
            description: row.description || "",
            createdBy: row.createdBy || "",
        });
    };

    const handleDeleteClick = (row) => {
        setSelectedRow(row);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        debugger
        if (selectedRow?.id) {
            dispatch(deleteRoles(selectedRow.id))
                .then(() => {
                    dispatch(getAllRoles());
                    setDeleteDialogOpen(false);
                    setSelectedRow(null);
                })
                .catch((err) => console.error("Delete roles failed:", err));
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedRow(null);
    };

    const rows = roles
        .filter((rol) => rol.isActive)

        .map((rol, index) => ({
            id: rol._id || index,
            roleName: rol.roleName,
            permissions: rol.permissions,
            description: rol.description,
            createdBy: rol.createdBy,
            isActive: rol.isActive,

        }));

    const rolesList = [
        { field: "roleName", headerName: "RoleName", flex: 1 },
        { field: "permissions", headerName: "Permissions", flex: 1 },
        { field: "description", headerName: "Description", flex: 1 },
        { field: "createdBy", headerName: "CreatedBy", flex: 1 },
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
        { label: "RoleName", name: "roleName", required: true, type: "text" },
        { label: "Permissions", name: "permissions", required: true, type: "text" },
        { label: "Descriptions", name: "description", required: true, type: "text" },
        { label: "CreatedBy", name: "createdBy", required: true, type: "text" },

    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {editingId ? "Edit Roles" : "Add New Roles"}
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
                                        "Update Roles"
                                    ) : (
                                        "Create Roles"
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
                    Roles Table
                </Typography>
                <Box sx={{ height: 500, width: "100%" }}>
                    <CustomizedDataGrid rows={rows} columns={rolesList} />
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
