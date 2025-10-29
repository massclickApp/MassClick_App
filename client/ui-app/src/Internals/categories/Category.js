import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategory,
  createCategory,
  editCategory,
  deleteCategory,
} from "../../redux/actions/categoryAction";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import "./categories.css";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
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
    parentCategoryId: "",
    title: "",
    keywords: [],
    description: "",
    seoTitle: "",
    seoDescription: "",
    slug: "",
  });

  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const subCategories = [
    "Services",
    "Construction Company",
    "Travels",
    "Restaurants",
    "Medical",
    "Events",
    "Education",
    "Garments",
    "Hotels",
    "Spa",
    "Real Estate",
    "Interior Designer",
    "Dealers",
    "Building Materials",
    "Shop",
    "CCTV",
    "Manufacturer",
    "Hostels",
  ];

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  // 🔹 Auto-generate slug from category
  useEffect(() => {
    if (formData.category) {
      const slug = formData.category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeywordChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, keywords: newValue }));
  };

  const handleEdit = (row) => {
    setEditMode(true);
    setFormData({
      _id: row._id,
      categoryImage: row.categoryImage || "",
      category: row.category,
      categoryType: row.categoryType,
      subCategoryType: row.subCategoryType,
      parentCategoryId: row.parentCategoryId || "",
      title: row.title,
      keywords: Array.isArray(row.keywords)
        ? row.keywords
        : row.keywords?.split(",") || [],
      description: row.description,
      seoTitle: row.seoTitle || "",
      seoDescription: row.seoDescription || "",
      slug: row.slug || "",
    });
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
    if (!formData.categoryType)
      newErrors.categoryType = "Category Type is required";
    if (formData.categoryType === "Sub Category" && !formData.subCategoryType)
      newErrors.subCategoryType = "Sub Category Type is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.keywords.length)
      newErrors.keywords = "At least one keyword is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

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
          parentCategoryId: "",
          title: "",
          keywords: [],
          description: "",
          seoTitle: "",
          seoDescription: "",
          slug: "",
        });
        setPreview(null);
        setEditMode(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        dispatch(getAllCategory());
      })
      .catch((err) =>
        console.error(
          editMode ? "Update category failed:" : "Create category failed:",
          err
        )
      );
  };

  const rows = category
    .filter((c) => c.isActive)
    .map((cat, index) => ({
      id: cat._id || index,
      _id: cat._id,
      categoryImage: cat.categoryImage,
      category: cat.category,
      categoryType: cat.categoryType,
      subCategoryType: cat.subCategoryType,
      title: cat.title,
      keywords:
        Array.isArray(cat.keywords) && cat.keywords.length
          ? cat.keywords.join(", ")
          : "-",
      description: cat.description,
      seoTitle: cat.seoTitle || "-",
      seoDescription: cat.seoDescription || "-",
      slug: cat.slug || "-",
      isActive: cat.isActive,
    }));

  const categoryList = [
    {
      field: "categoryImage",
      headerName: "Image",
      flex: 1,
      renderCell: (params) =>
        params.value ? <Avatar src={params.value} alt="img" /> : "-",
    },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "categoryType", headerName: "Type", flex: 1 },
    { field: "subCategoryType", headerName: "Sub Type", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "keywords", headerName: "Keywords", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "seoTitle", headerName: "SEO Title", flex: 1 },
    { field: "seoDescription", headerName: "SEO Description", flex: 1 },
    { field: "slug", headerName: "Slug", flex: 1 },
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
      {/* Category Form */}
      <div className="category-card form-section">
        <h2 className="card-title">
          {editMode ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-input-group">
            <label className="input-label">Category</label>
            <input
              type="text"
              name="category"
              className={`text-input ${errors.category ? "error" : ""}`}
              value={formData.category}
              onChange={handleChange}
            />
            {errors.category && (
              <p className="error-text">{errors.category}</p>
            )}
          </div>

          <div className="form-input-group">
            <label className="input-label">Slug (Auto)</label>
            <input
              type="text"
              name="slug"
              className="text-input"
              value={formData.slug}
              readOnly
            />
          </div>

          <div className="form-input-group">
            <label className="input-label">Category Type</label>
            <select
              name="categoryType"
              className={`select-input ${errors.categoryType ? "error" : ""}`}
              value={formData.categoryType}
              onChange={handleChange}
            >
              <option value="">-- Select Type --</option>
              <option value="Primary Category">Primary Category</option>
              <option value="Sub Category">Sub Category</option>
            </select>
            {errors.categoryType && (
              <p className="error-text">{errors.categoryType}</p>
            )}
          </div>

          {formData.categoryType === "Sub Category" && (
            <div className="form-input-group">
              <label className="input-label">Sub Category Type</label>
              <select
                name="subCategoryType"
                className={`select-input ${
                  errors.subCategoryType ? "error" : ""
                }`}
                value={formData.subCategoryType}
                onChange={handleChange}
              >
                <option value="">-- Select Sub Category --</option>
                {subCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              {errors.subCategoryType && (
                <p className="error-text">{errors.subCategoryType}</p>
              )}
            </div>
          )}

          <div className="form-input-group">
            <label className="input-label">Title</label>
            <input
              type="text"
              name="title"
              className={`text-input ${errors.title ? "error" : ""}`}
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          <div className="form-input-group">
            <label className="input-label">Keywords</label>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.keywords}
              onChange={handleKeywordChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Add keywords"
                  error={!!errors.keywords}
                  helperText={errors.keywords}
                />
              )}
            />
          </div>

          <div className="form-input-group col-span-2">
            <label className="input-label">Description</label>
            <textarea
              name="description"
              className={`text-input text-area ${
                errors.description ? "error" : ""
              }`}
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
            {errors.description && (
              <p className="error-text">{errors.description}</p>
            )}
          </div>

          <div className="form-input-group">
            <label className="input-label">SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              className="text-input"
              value={formData.seoTitle}
              onChange={handleChange}
            />
          </div>

          <div className="form-input-group">
            <label className="input-label">SEO Description</label>
            <input
              type="text"
              name="seoDescription"
              className="text-input"
              value={formData.seoDescription}
              onChange={handleChange}
            />
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
              <div style={{ marginBottom: "10px" }}>
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
          </div>
        </form>
        {error && (
          <p className="error-text" style={{ marginTop: "16px" }}>
            {typeof error === "string"
              ? error
              : error.message || JSON.stringify(error)}
          </p>
        )}
      </div>

      {/* Category Table */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Category Table
        </Typography>
        <Box sx={{ height: 500, width: "100%" }}>
          <CustomizedDataGrid rows={rows} columns={categoryList} />
        </Box>
      </Paper>

      {/* Delete Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirm({ open: false, id: null })}
            color="secondary"
          >
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
