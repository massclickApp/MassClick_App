import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategory,
  createCategory,
  editCategory,
  deleteCategory,
} from "../../redux/actions/categoryAction";
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editMode ? "Edit Category" : "Add New Category"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            {/* Category Field */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                variant="standard"
                value={formData.category}
                onChange={handleChange}
                sx={textFieldStyle}
                error={Boolean(errors.category)}
                helperText={errors.category || ""}
              />
            </Grid>

            {/* Category Type */}
            <FormControl
              variant="standard"
              sx={textFieldStyle}
              style={{ minWidth: 220 }}
            >
              <InputLabel id="category-type-label">Category Type</InputLabel>
              <Select
                labelId="category-type-label"
                value={formData.categoryType}
                onChange={(event) =>
                  setFormData({ ...formData, categoryType: event.target.value })
                }
                error={Boolean(errors.categoryType)}
                helperText={errors.categoryType || ""}
                input={<Input />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Primary Category" sx={menuItemStyle}>
                  Primary Category
                </MenuItem>
                <MenuItem value="Sub Category" sx={menuItemStyle}>
                  Sub Category
                </MenuItem>
              </Select>
            </FormControl>

            {/* Sub Category Type */}
            {formData.categoryType === "Sub Category" && (
              <Grid item xs={12} sm={4}>
                <FormControl
                  variant="standard"
                  sx={textFieldStyle}
                  style={{ minWidth: 220 }}
                >
                  <InputLabel id="sub-category-type-label">
                    Sub Category Type
                  </InputLabel>
                  <Select
                    labelId="sub-category-type-label"
                    value={formData.subCategoryType}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        subCategoryType: event.target.value,
                      })
                    }

                    input={<Input />}
                  >
                    {subCategories.map((sub) => (
                      <MenuItem key={sub} value={sub} sx={menuItemStyle}>
                        {sub}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Title Field */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                variant="standard"
                value={formData.title}
                onChange={handleChange}
                sx={textFieldStyle}
                error={Boolean(errors.title)}
                helperText={errors.title || ""}
              />
            </Grid>

            {/* Keywords Field */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Keywords"
                name="keywords"
                variant="standard"
                value={formData.keywords}
                onChange={handleChange}
                sx={textFieldStyle}
                error={Boolean(errors.keywords)}
                helperText={errors.keywords || ""}
              />
            </Grid>

            {/* Description Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                variant="standard"
                value={formData.description}
                onChange={handleChange}
                sx={textFieldStyle}
                error={Boolean(errors.description)}
                helperText={errors.description || ""}
              />
            </Grid>

            {/* Image Upload Field */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    component="label"
                    sx={{ minWidth: 150 }}
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
                  {errors?.category && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.category}
                    </Typography>
                  )}
                </Box>

                {preview && (
                  <Avatar
                    src={preview}
                    sx={{ width: 56, height: 56 }}
                  />
                )}
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : editMode ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </Button>
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

      {/* Category Table */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Category Table
        </Typography>
        <Box sx={{ height: 500, width: "100%" }}>
          <CustomizedDataGrid rows={rows} columns={categoryList} />
        </Box>
      </Paper>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{deleteConfirm.itemName || "this category"}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, id: null })} color="secondary">
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
    </Container>
  );
}
