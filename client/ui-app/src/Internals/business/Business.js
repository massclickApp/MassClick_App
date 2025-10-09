import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList, createBusinessList, editBusinessList, deleteBusinessList } from "../../redux/actions/businessListAction";
import { getAllLocation } from "../../redux/actions/locationAction";
import { getAllCategory } from "../../redux/actions/categoryAction";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';

export default function BusinessList() {
    const dispatch = useDispatch();
    const { businessList = [], loading, error } = useSelector(
        (state) => state.businessListReducer || {}
    );
    const { location = [] } = useSelector((state) => state.locationReducer || {});
    const { category = [] } = useSelector((state) => state.categoryReducer || {});
    const fileInputRef = useRef();

    const [businessvalue, setBusinessValue] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [newGalleryImages, setNewGalleryImages] = useState([]);

    const [galleryDialog, setGalleryDialog] = useState({
        open: false,
        data: null,
    });

    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((images) => {
            setNewGalleryImages((prev) => [...prev, ...images]);
        });
    };
  const handleUploadGalleryImages = async () => {
    if (!galleryDialog.data?._id) return;

    try {
        const uploadPayload = {
            businessImages: newGalleryImages.length > 0 ? newGalleryImages : null,
        };

        const updatedBusiness = await dispatch(
            editBusinessList(galleryDialog.data._id, uploadPayload)
        );

        setGalleryDialog((prev) => ({
            ...prev,
            data: { ...prev.data, businessImages: updatedBusiness.businessImages },
        }));

        setNewGalleryImages([]);
        handleCloseGallery();
        await dispatch(getAllBusinessList());
    } catch (err) {
        console.error("Upload failed:", err);
    }
};




    const defaultOpeningHours = [
        { day: "Monday", open: "", close: "", isClosed: false },
        { day: "Tuesday", open: "", close: "", isClosed: false },
        { day: "Wednesday", open: "", close: "", isClosed: false },
        { day: "Thursday", open: "", close: "", isClosed: false },
        { day: "Friday", open: "", close: "", isClosed: false },
        { day: "Saturday", open: "", close: "", isClosed: false },
        { day: "Sunday", open: "", close: "", isClosed: false },
    ];



    const handleOpenGallery = (rowId) => {
        const business = businessList.find((b) => b._id === rowId);

        if (business) {
            setGalleryDialog({ open: true, data: business });
            setNewGalleryImages([]);
        } else {
            console.error("Business not found in Redux store");
        }
    };


    const handleCloseGallery = () => {
        setGalleryDialog({ open: false, data: null });
    };

    const [formData, setFormData] = useState({
        clientId: "",
        businessName: "",
        plotNumber: "",
        street: "",
        pincode: "",
        email: "",
        contact: "",
        contactList: "",
        gstin: "",
        whatsappNumber: "",
        experience: "",
        location: "",
        category: "",
        bannerImage: "",
        googleMap: "",
        website: "",
        facebook: "",
        instagram: "",
        youtube: "",
        pinterest: "",
        twitter: "",
        linkedin: "",
        businessDetails: "",
        openingHours: defaultOpeningHours,

    });

    const [preview, setPreview] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        id: null,
    });
    const textFieldStyle = {
        "& .MuiInputBase-root": {
            height: 50,
            fontSize: "1.1rem",
        },
        "& .MuiInputLabel-root": {
            fontSize: "1rem",
        },
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
        "video",
    ];
    const validateForm = () => {
        let newErrors = {};

        // Required fields
        if (!formData.clientId) newErrors.clientId = "Client ID is required";
        if (!formData.businessName) newErrors.businessName = "Business Name is required";
        if (!formData.experience) newErrors.experience = "Experience is required";
        if (!formData.location) newErrors.location = "Location is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!businessvalue || businessvalue === "<p><br></p>") newErrors.businessDetails = "Business Details is required";

        // Email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Contact number validation
        if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
            newErrors.contact = "Contact should be 10 digits";
        }

        // Whatsapp number validation
        if (formData.whatsappNumber && !/^\d{10}$/.test(formData.whatsappNumber)) {
            newErrors.whatsappNumber = "Whatsapp number should be 10 digits";
        }

        // Pincode validation
        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Pincode should be 6 digits";
        }

        // GSTIN validation
        if (formData.gstin && !/^[0-9A-Z]{15}$/.test(formData.gstin)) {
            newErrors.gstin = "GSTIN should be 15 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBusinessChange = (content) => {
        setBusinessValue(content);
        setFormData((prev) => ({ ...prev, businessDetails: content }));
    };
    const handleOpeningHourChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedHours = [...(prev.openingHours || defaultOpeningHours)];
            updatedHours[index][field] = value;
            if (field === "isClosed" && value) {
                updatedHours[index].open = "";
                updatedHours[index].close = "";
            }
            return { ...prev, openingHours: updatedHours };
        });
    };
    useEffect(() => {
        dispatch(getAllBusinessList());
        dispatch(getAllLocation());
        dispatch(getAllCategory())
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (row) => {
        setEditMode(true);
        setEditId(row.id);
        setFormData({
            ...row,
            openingHours: row.openingHours?.length ? row.openingHours : defaultOpeningHours,
        }); setBusinessValue(row.businessDetails || "");
        setPreview(row.bannerImage || null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (row) => {
        setDeleteDialog({ open: true, id: row.id });
    };
    const confirmDelete = () => {
        if (deleteDialog.id) {
            dispatch(deleteBusinessList(deleteDialog.id)).then(() => {
                dispatch(getAllBusinessList());
            });
        }
        setDeleteDialog({ open: false, id: null });
    };
    const resetForm = () => {
        setFormData({
            clientId: "",
            businessName: "",
            plotNumber: "",
            street: "",
            pincode: "",
            email: "",
            contact: "",
            contactList: "",
            gstin: "",
            whatsappNumber: "",
            experience: "",
            location: "",
            category: "",
            bannerImage: "",
            googleMap: "",
            website: "",
            facebook: "",
            instagram: "",
            youtube: "",
            pinterest: "",
            twitter: "",
            linkedin: "",
            businessDetails: "",
            openingHours: defaultOpeningHours,

        });
        setBusinessValue("");
        setPreview(null);
        setEditMode(false);
        setEditId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, bannerImage: reader.result }));
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = { ...formData, businessDetails: businessvalue };

        if (editMode && editId) {
            dispatch(editBusinessList(editId, payload))
                .then(() => {
                    resetForm();
                    dispatch(getAllBusinessList());
                })
                .catch((err) => console.error("Edit failed:", err));
        } else {
            dispatch(createBusinessList(payload))
                .then(() => {
                    resetForm();
                    dispatch(getAllBusinessList());
                })
                .catch((err) => console.error("Create failed:", err));
        }
    };


    const rows = businessList.map((bl, index) => ({
        id: bl._id || index,
        _id: bl._id,
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
        businessImages: bl.businessImages || [],
        googleMap: bl.googleMap || "-",
        website: bl.website || "-",
        facebook: bl.facebook || "-",
        instagram: bl.instagram || "-",
        youtube: bl.youtube || "-",
        pinterest: bl.pinterest || "-",
        twitter: bl.twitter || "-",
        linkedin: bl.linkedin || "-",
        businessDetails: bl.businessDetails || "-",
        openingHours: bl.openingHours || defaultOpeningHours,

    }));


    const businessListTable = [
        { field: "clientId", headerName: "ClientId", flex: 1 },
        {
            field: "bannerImage",
            headerName: "Banner Image",
            flex: 1,
            renderCell: (params) =>
                params.value ? <Avatar src={params.value} alt="img" /> : "-",
        },
        { field: "businessName", headerName: "Business Name", flex: 1 },
        // { field: "plotNumber", headerName: "Plot Number", flex: 1 },
        // { field: "street", headerName: "Street", flex: 1 },
        // { field: "pincode", headerName: "Pincode", flex: 1 },
        // { field: "email", headerName: "Email", flex: 1 },
        // { field: "contact", headerName: "Contact", flex: 1 },
        // { field: "contactList", headerName: "Contact List", flex: 1 },
        // { field: "gstin", headerName: "GSTIN", flex: 1 },
        // { field: "whatsappNumber", headerName: "Whatsapp Number", flex: 1 },
        // { field: "experience", headerName: "Experience", flex: 1 },
        { field: "location", headerName: "Location", flex: 1 },
        { field: "category", headerName: "Category", flex: 1 },
        { field: "isActive", headerName: "Status", flex: 1 },

        // { field: "googleMap", headerName: "Google Map", flex: 1 },
        // { field: "website", headerName: "Website", flex: 1 },
        // { field: "facebook", headerName: "Facebook", flex: 1 },
        // { field: "instagram", headerName: "Instagram", flex: 1 },
        // { field: "youtube", headerName: "Youtube", flex: 1 },
        // { field: "pinterest", headerName: "Pinterest", flex: 1 },
        // { field: "twitter", headerName: "Twitter", flex: 1 },
        // { field: "linkedin", headerName: "LinkedIn", flex: 1 },
        // { field: "businessDetails", headerName: "Business Details", flex: 1 },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <IconButton color="primary"
                        size="small"
                        onClick={() => handleEdit(params.row)}>
                        <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error"
                        size="small"
                        onClick={() => handleDelete(params.row)}>
                        <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                </div>
            ),
        },
        {
            field: "gallery",
            headerName: "Gallery",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    color="primary"
                    onClick={() => handleOpenGallery(params.row._id)}
                >
                    <CollectionsBookmarkOutlinedIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {editMode ? "Edit Business" : "Add New Business"}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={8}>
                        {/* Client ID */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Client ID"
                                name="clientId"
                                variant="standard"
                                value={formData.clientId}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.clientId)}
                                helperText={errors.clientId || ""}
                            />
                        </Grid>

                        {/* Business Name */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Business Name"
                                name="businessName"
                                variant="standard"
                                value={formData.businessName}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.businessName)}
                                helperText={errors.businessName || ""}

                            />
                        </Grid>

                        {/* Plot Number */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Plot Number"
                                name="plotNumber"
                                variant="standard"
                                value={formData.plotNumber}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.plotNumber)}
                                helperText={errors.plotNumber || ""}
                            />
                        </Grid>

                        {/* Street */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Street"
                                name="street"
                                variant="standard"
                                value={formData.street}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        {/* Pincode */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Pincode"
                                name="pincode"
                                variant="standard"
                                value={formData.pincode}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.pincode)}
                                helperText={errors.pincode || ""}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                variant="standard"
                                value={formData.email}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.email)}
                                helperText={errors.email || ""}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Contact"
                                name="contact"
                                variant="standard"
                                value={formData.contact}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.contact)}
                                helperText={errors.contact || ""}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Contact List"
                                name="contactList"
                                variant="standard"
                                value={formData.contactList}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="GSTIN"
                                name="gstin"
                                variant="standard"
                                value={formData.gstin}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.gstin)}
                                helperText={errors.gstin || ""}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Whatsapp Number"
                                name="whatsappNumber"
                                variant="standard"
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.whatsappNumber)}
                                helperText={errors.whatsappNumber || ""}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Experience"
                                name="experience"
                                variant="standard"
                                value={formData.experience}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.experience)}
                                helperText={errors.experience || ""}
                            />

                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                fullWidth
                                label="Location"
                                name="location"
                                variant="standard"
                                value={formData.location}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.location)}
                                helperText={errors.location || ""}
                            >
                                {location.map((loc) => (
                                    <MenuItem key={loc._id} value={loc.city}>
                                        {loc.city}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>


                        {/* Category */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                name="category"
                                variant="standard"
                                value={formData.category}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                                error={Boolean(errors.category)}
                                helperText={errors.category || ""}
                            >

                                {category.map((cat) => (
                                    <MenuItem key={cat._id} value={cat.category}>
                                        {cat.category}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Google Map */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Google Map"
                                name="googleMap"
                                variant="standard"
                                value={formData.googleMap}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        {/* Website */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Website"
                                name="website"
                                variant="standard"
                                value={formData.website}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        {/* Facebook */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Facebook"
                                name="facebook"
                                variant="standard"
                                value={formData.facebook}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        {/* Instagram */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Instagram"
                                name="instagram"
                                variant="standard"
                                value={formData.instagram}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        {/* YouTube */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="YouTube"
                                name="youtube"
                                variant="standard"
                                value={formData.youtube}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        {/* Pinterest */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Pinterest"
                                name="pinterest"
                                variant="standard"
                                value={formData.pinterest}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        {/* Twitter */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Twitter"
                                name="twitter"
                                variant="standard"
                                value={formData.twitter}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>

                        {/* LinkedIn */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="LinkedIn"
                                name="linkedin"
                                variant="standard"
                                value={formData.linkedin}
                                onChange={handleChange}
                                sx={textFieldStyle}
                                style={{ minWidth: 260 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                                    {errors?.businessList && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                            {errors.businessList}
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
                        {/* Business Details */}


                    </Grid>
                    <Grid item xs={12}>
                        <ReactQuill
                            theme="snow"
                            value={businessvalue}
                            onChange={handleBusinessChange}
                            modules={modules}
                            formats={formats}
                            placeholder="Type business details here..."
                            style={{ height: '200px' }}
                            error={Boolean(errors.businessvalue)}
                            helperText={errors.businessvalue || ""}
                        />
                    </Grid><br />
                    <Grid item xs={12}> <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Opening Hours</Typography> {formData.openingHours.map((hour, index) => (<Grid container spacing={2} alignItems="center" key={hour.day} sx={{ mb: 1 }}> <Grid item xs={2}> <TextField fullWidth variant="standard" label={hour.day} value={hour.day} disabled /> </Grid> <Grid item xs={3}> <TextField fullWidth type="time" variant="standard" label="Open" value={hour.open} onChange={(e) => handleOpeningHourChange(index, "open", e.target.value)} disabled={hour.isClosed} InputLabelProps={{ shrink: true }} /> </Grid>
                        <Grid item xs={3}> <TextField fullWidth type="time" variant="standard" label="Close" value={hour.close} onChange={(e) => handleOpeningHourChange(index, "close", e.target.value)} disabled={hour.isClosed} InputLabelProps={{ shrink: true }} /> </Grid> <Grid item xs={2}> <TextField fullWidth select label="Closed" variant="standard" value={hour.isClosed} onChange={(e) => handleOpeningHourChange(index, "isClosed", e.target.value === "true")} > <MenuItem value={false}>Open</MenuItem> <MenuItem value={true}>Closed</MenuItem> </TextField> </Grid> </Grid>))} </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", mt: 10, gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{ minWidth: 150 }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : editMode ? (
                                    "Update Business"
                                ) : (
                                    "Create Business"
                                )}
                            </Button>
                            {editMode && (
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
                </Box>
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {typeof error === "string" ? error : error.message || JSON.stringify(error)}
                    </Typography>
                )}
            </Paper>

            {/* Category Table */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    BusinessList Table
                </Typography>
                <Box sx={{ height: 500, width: "100%" }}>
                    <CustomizedDataGrid rows={rows} columns={businessListTable} />
                </Box>
            </Paper>
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, id: null, name: "" })}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete{" "}
                    <strong>{deleteDialog.name || "this business"}</strong>?
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialog({ open: false, id: null, name: "" })}
                        color="secondary"
                    >
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
            <Dialog open={galleryDialog.open} onClose={handleCloseGallery} maxWidth="md" fullWidth>
                <DialogTitle>Gallery - {galleryDialog.data?.businessName}</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {/* Existing images */}
                        {galleryDialog.data?.businessImages?.map((img, idx) => (
                            <Avatar key={idx} src={img} sx={{ width: 100, height: 100 }} />
                        ))}

                        {/* New selected images */}
                        {newGalleryImages.map((img, idx) => (
                            <Avatar
                                key={idx}
                                src={img}
                                sx={{ width: 100, height: 100, border: "2px dashed green" }}
                            />
                        ))}
                    </Box>

                    {/* Upload input */}
                    <Button variant="contained" component="label" sx={{ mt: 2 }}>
                        Upload Images
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleGalleryImageChange}
                        />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseGallery} color="secondary">
                        Close
                    </Button>
                    <Button
                        onClick={handleUploadGalleryImages}
                        color="primary"
                        variant="contained"
                        disabled={newGalleryImages.length === 0}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>


        </Container>
    );
}