import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, createUser, editUser, deleteUser } from "../../redux/actions/userAction.js";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import { getAllRoles } from "../../redux/actions/rolesAction.js";
import {
  Box,
  Button,
 
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

} from "@mui/material";
import './user.css'
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

export default function User() {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.userReducer || {});
  const { roles = [] } = useSelector(
    (state) => state.rolesReducer || {}
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    contact: "",
    businessLocation: "",
    businessCategory: "",
    emailId: "",
    role: "",
  });

  // 🔹 Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllRoles());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditMode && editUserId) {
      dispatch(editUser(editUserId, formData))
        .then(() => {
          resetForm();
          dispatch(getAllUsers());
        })
        .catch((err) => console.error("Update user failed:", err));
    } else {
      dispatch(createUser(formData))
        .then(() => {
          resetForm();
          dispatch(getAllUsers());
        })
        .catch((err) => console.error("Create user failed:", err));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.userName) newErrors.userName = "User Name is required";
    if (!formData.contact) newErrors.contact = "Contact is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.emailId) newErrors.emailId = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.emailId)) newErrors.emailId = "Invalid email format";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.businessLocation) newErrors.businessLocation = "Business Location is required";
    if (!formData.businessCategory) newErrors.businessCategory = "Business Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (row) => {
    setFormData({
      userName: row.userName,
      password: "",
      contact: row.contact,
      role: row.role,
      emailId: row.emailId,
      businessLocation: row.businessLocation,
      businessCategory: row.businessCategory,
    });
    setEditUserId(row.id);
    setIsEditMode(true);
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      password: "",
      contact: "",
      businessLocation: "",
      businessCategory: "",
      emailId: "",
      role: "",
    });
    setErrors({});
    setEditUserId(null);
    setIsEditMode(false);
    setShowPassword(false);
  };

  const handleDeleteClick = (row) => {
    setSelectedUser(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id))
        .then(() => {
          dispatch(getAllUsers());
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        })
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const rows = users
    .filter((user) => user.isActive)
    .map((user, index) => ({
      id: user._id || index,
      userName: user.userName,
      password: user.password,
      contact: user.contact,
      emailId: user.emailId,
      role: user.role,
      businessLocation: user.businessLocation || "-",
      businessCategory: user.businessCategory || "-",
      isActive: user.isActive,
    }));

  const userList = [
    { field: "userName", headerName: "User Name", flex: 1 },
    { field: "emailId", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "businessLocation", headerName: "Business Location", flex: 1 },
    { field: "businessCategory", headerName: "Business Category", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton color="primary" size="small" onClick={() => handleEdit(params.row)}>
            <EditRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDeleteClick(params.row)}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  const fields = [
    { label: "UserName", name: "userName", required: true, type: "text" },
    { label: "Password", name: "password", required: true, type: "password" },
    { label: "Contact", name: "contact", required: true, type: "text" },
    { label: "Role", name: "role", required: true, type: "select" },
    { label: "EmailId", name: "emailId", required: true, type: "email" },
    { label: "BusinessLocation", name: "businessLocation", required: true, type: "text" },
    { label: "BusinessCategory", name: "businessCategory", required: true, type: "text" },
  ];

  return (
    <div className="user-page">
      <div className="user-card form-section">
        <h2 className="user-card-title">
          {isEditMode ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit} className="user-form-grid">
          {fields.map((field, i) => {
            const isPassword = field.type === "password";
            const isRole = field.type === "select" && field.name === "role";

            return (
              <div key={i} className="user-form-input-group">
                <label htmlFor={field.name} className="user-input-label">
                  {field.label}
                </label>

                {isRole ? (
                  <select
                    id={field.name}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`user-select-input ${errors.role ? "error" : ""}`}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role.roleName}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                ) : isPassword ? (
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id={field.name}
                      name={field.name}
                      placeholder={isEditMode ? "Enter new password" : ""}
                      value={formData.password || ""}
                      onChange={handleChange}
                      className={`user-text-input ${errors.password ? "error" : ""}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`user-text-input ${errors[field.name] ? "error" : ""}`}
                  />
                )}

                {errors[field.name] && (
                  <p className="user-error-text">{errors[field.name]}</p>
                )}
              </div>
            );
          })}

          <div className="user-button-group col-span-all">
            <button type="submit" className="user-submit-button" disabled={loading}>
              {loading
                ? "Loading..."
                : isEditMode
                  ? "Update User"
                  : "Create User"}
            </button>

            {isEditMode && (
              <button
                type="button"
                className="user-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && (
          <p className="user-error-text" style={{ marginTop: "16px" }}>
            {typeof error === "string" ? error : error.message || JSON.stringify(error)}
          </p>
        )}
      </div>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          User Table
        </Typography>
        <Box sx={{ height: 500, width: "100%" }}>
          <CustomizedDataGrid rows={rows} columns={userList} />
        </Box>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{selectedUser?.userName || "this user"}</strong>?
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
    </div>
  );
}