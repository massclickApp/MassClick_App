import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategory,
  createCategory,
  editCategory,
  deleteCategory,
} from "../../redux/actions/categoryAction";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import './categories.css'
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Input from "@mui/material/Input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


export default function Category() {
  const dispatch = useDispatch();
  const { category = [], loading, error } = useSelector(
    (state) => state.categoryReducer || {}
  );
  const fileInputRef = useRef();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    _id: null,
    categoryImage: "",
    category: "",
    categoryType: "",
    subCategoryType: "",
    title: "",
    keywords: "",
    description: "",
  });

  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const textFieldStyle = {
    "& .MuiInputBase-root": { height: 50, fontSize: "1.1rem" },
    "& .MuiInputLabel-root": { fontSize: "1rem" },
  };

  const subCategories = [
    "Services", "Construction Company", "Travels", "Restaurants", "Medical",
    "Events", "Education", "Garments", "Hotels", "Spa", "Real Estate",
    "Interior Designer", "Dealers", "Building Materials", "Shop", "CCTV",
    "Manufacturer", "Hostels"
  ];

  const menuItemStyle = { fontSize: "1rem", height: "40px" };

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (row) => {
    setEditMode(true);
    setFormData(row);
    setPreview(row.categoryImage || null);
  };

  const handleDelete = (row) => {
    setDeleteConfirm({ open: true, id: row.id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.id) {
      dispatch(deleteCategory(deleteConfirm.id))
        .then(() => dispatch(getAllCategory()))
        .catch((err) => console.error("Delete failed:", err))
        .finally(() => setDeleteConfirm({ open: false, id: null }));
    }
  };
  const validateForm = () => {
    let newErrors = {};

    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.categoryType) newErrors.categoryType = "Category Type is required";
    if (formData.categoryType === "Sub Category" && !formData.subCategoryType)
      newErrors.subCategoryType = "Sub Category Type is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.keywords.trim()) newErrors.keywords = "Keywords are required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, categoryImage: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (
      formData.categoryType === "Sub Category" &&
      !formData.subCategoryType.trim()
    ) {
      alert("Sub Category Type is required!");
      return;
    }

    const action = editMode
      ? editCategory(formData._id, formData)
      : createCategory(formData);

    dispatch(action)
      .then(() => {
        setFormData({
          _id: null,
          categoryImage: "",
          category: "",
          categoryType: "",
          subCategoryType: "",
          title: "",
          keywords: "",
          description: "",
        });
        setPreview(null);
        setEditMode(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        dispatch(getAllCategory());
      })
      .catch((err) =>
        console.error(editMode ? "Update category failed:" : "Create category failed:", err)
      );
  };

  const rows = category
    .filter((category) => category.isActive)

    .map((cat, index) => ({
      id: cat._id || index,
      _id: cat._id,
      categoryImage: cat.categoryImage,
      category: cat.category,
      categoryType: cat.categoryType,
      subCategoryType: cat.subCategoryType,
      title: cat.title || "-",
      keywords: cat.keywords || "-",
      description: cat.description || "-",
      isActive: cat.isActive,

    }));

  const categoryList = [
    {
      field: "categoryImage",
      headerName: "Category Image",
      flex: 1,
      renderCell: (params) =>
        params.value ? <Avatar src={params.value} alt="img" /> : "-",
    },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "categoryType", headerName: "Category Type", flex: 1 },
    { field: "subCategoryType", headerName: "Sub Category Type", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "keywords", headerName: "Keywords", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
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
            onClick={() => handleDelete(params.row)}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
  <div className="category-page">
        {/* Category Form - Replacing MUI Paper/Container/Grid with pure CSS */}
        <div className="category-card form-section">
          <h2 className="card-title">
            {editMode ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="form-grid">

            {/* Category Field */}
            <div className="form-input-group">
              <label htmlFor="category" className="input-label">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                className={`text-input ${errors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && <p className="error-text">{errors.category}</p>}
            </div>

            {/* Category Type Select */}
            <div className="form-input-group">
              <label htmlFor="categoryType" className="input-label">Category Type</label>
              <select
                id="categoryType"
                name="categoryType"
                className={`select-input ${errors.categoryType ? 'error' : ''}`}
                value={formData.categoryType}
                onChange={handleChange}
              >
                <option value="">-- Select Type --</option>
                <option value="Primary Category">Primary Category</option>
                <option value="Sub Category">Sub Category</option>
              </select>
              {errors.categoryType && <p className="error-text">{errors.categoryType}</p>}
            </div>

            {/* Sub Category Type Select (Conditional) */}
            {formData.categoryType === "Sub Category" && (
              <div className="form-input-group">
                <label htmlFor="subCategoryType" className="input-label">Sub Category Type</label>
                <select
                  id="subCategoryType"
                  name="subCategoryType"
                  className={`select-input ${errors.subCategoryType ? 'error' : ''}`}
                  value={formData.subCategoryType}
                  onChange={handleChange}
                >
                  <option value="">-- Select Sub Category --</option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                {errors.subCategoryType && <p className="error-text">{errors.subCategoryType}</p>}
              </div>
            )}

            <div className="form-input-group">
              <label htmlFor="title" className="input-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className={`text-input ${errors.title ? 'error' : ''}`}
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <p className="error-text">{errors.title}</p>}
            </div>

            <div className="form-input-group">
              <label htmlFor="keywords" className="input-label">Keywords</label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                className={`text-input ${errors.keywords ? 'error' : ''}`}
                value={formData.keywords}
                onChange={handleChange}
              />
              {errors.keywords && <p className="error-text">{errors.keywords}</p>}
            </div>

            <div className={`form-input-group description-field ${formData.categoryType !== "Sub Category" ? 'col-span-2' : ''}`}>
              <label htmlFor="description" className="input-label">Description</label>
              <textarea
                id="description"
                name="description"
                className={`text-input text-area ${errors.description ? 'error' : ''}`}
                value={formData.description}
                onChange={handleChange}
                rows="3"
              ></textarea>
              {errors.description && <p className="error-text">{errors.description}</p>}
            </div>

            <div className="form-input-group col-span-all upload-section">
              <div className="upload-content">
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  component="label"
                  className="upload-button"
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </Button>
                {preview && (
                  <Avatar
                    src={preview}
                    sx={{ width: 56, height: 56 }}
                    className="preview-avatar"
                  />
                )}
<div style={{ marginBottom: "10px" }}>  {/* was 20px before */}
                 <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : editMode ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </button>
              </div>
              </div>
              <div></div>
            </div>

          
          </form>
          {error && (
              <p className="error-text" style={{ marginTop: '16px' }}>
                {typeof error === "string" ? error : error.message || JSON.stringify(error)}
              </p>
            )}
        </div>

        {/* Category Table Section */}
         <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Category Table
        </Typography>
        <Box sx={{ height: 500, width: "100%" }}>
          <CustomizedDataGrid rows={rows} columns={categoryList} />
        </Box>
      </Paper>

        {/* Delete Confirm Dialog (MUI Dialog retained for simple function) */}
        <Dialog
          open={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ open: false, id: null, itemName: "" })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete{" "}
            <strong>{deleteConfirm.itemName || "this category"}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm({ open: false, id: null, itemName: "" })} color="secondary">
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}
