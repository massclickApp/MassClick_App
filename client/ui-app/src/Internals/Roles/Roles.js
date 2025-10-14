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
import './roles.css'

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
      <div className="role-page">
    <div className="role-card form-section">
        <h2 className="role-card-title">{editingId ? "Edit Roles" : "Add New Roles"}</h2>
        <form onSubmit={handleSubmit} className="role-form-grid">
            {fields.map((field, i) => (
                <div key={i} className="role-form-input-group">
                    <label htmlFor={field.name} className="role-input-label">{field.label}</label>
                    <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className={`role-text-input ${errors[field.name] ? "error" : ""}`}
                    />
                    {errors[field.name] && (
                        <p className="role-error-text">{errors[field.name]}</p>
                    )}
                </div>
            ))}

            <div className="role-button-group col-span-all">
                <button type="submit" className="role-submit-button" disabled={loading}>
                    {loading ? "Loading..." : editingId ? "Update Roles" : "Create Roles"}
                </button>
                {editingId && (
                    <button type="button" className="role-cancel-button" onClick={resetForm}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
        {error && <p className="role-error-text" style={{ marginTop: "16px" }}>{typeof error === "string" ? error : error.message || JSON.stringify(error)}</p>}
    </div>

    {/* 🔹 Roles Table Section */}
        <h3>Roles Table</h3>
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
            Are you sure you want to delete <strong>{selectedRow?.roleName || "this role"}</strong>?
        </DialogContent>
        <DialogActions>
            <Button onClick={cancelDelete} color="secondary">Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
    </Dialog>
</div>

    );
}
