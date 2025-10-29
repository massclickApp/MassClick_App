import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList, createBusinessList, editBusinessList, deleteBusinessList } from "../../redux/actions/businessListAction";
import { getAllLocation } from "../../redux/actions/locationAction";
import { getAllCategory } from "../../redux/actions/categoryAction";
import { getAllUsersClient } from "../../redux/actions/userClientAction";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import './business.css'
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DetailsIcon from '@mui/icons-material/Details';
import CategoryIcon from '@mui/icons-material/Category';
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
  // Stepper Imports:
  Stack,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

// Stepper-specific imports and custom components (Qonto/Colorlib)
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';


const ORANGE_PRIMARY = '#FF8C00';
const ORANGE_HOVER = '#D97800';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        `linear-gradient( 95deg, ${ORANGE_PRIMARY} 0%, ${ORANGE_HOVER} 50%, #FFB643 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        `linear-gradient( 95deg, ${ORANGE_PRIMARY} 0%, ${ORANGE_HOVER} 50%, #FFB643 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      `linear-gradient( 136deg, ${ORANGE_PRIMARY} 0%, ${ORANGE_HOVER} 50%, #FFB643 100%)`,
    boxShadow: '0 4px 10px 0 rgba(255, 140, 0, 0.4)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      `linear-gradient( 136deg, ${ORANGE_PRIMARY} 0%, ${ORANGE_HOVER} 50%, #FFB643 100%)`,
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <BusinessCenterIcon />, 
    2: <CategoryIcon />, 
    3: <DetailsIcon />, 
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = ['Business Info', 'Category & Keywords', 'Details & UploadImages'];



export default function BusinessList() {
  const dispatch = useDispatch();
  const { businessList = [], loading, error } = useSelector(
    (state) => state.businessListReducer || {}
  );
  const { users = [], } = useSelector(
    (state) => state.userClientReducer || {}
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

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    { day: "Monday", open: "", close: "", isClosed: false, is24Hours: false },
    { day: "Tuesday", open: "", close: "", isClosed: false, is24Hours: false },
    { day: "Wednesday", open: "", close: "", isClosed: false, is24Hours: false },
    { day: "Thursday", open: "", close: "", isClosed: false, is24Hours: false },
    { day: "Friday", open: "", close: "", isClosed: false, is24Hours: false },
    { day: "Saturday", open: "", close: "", isClosed: false, is24Hours: false },
    { day: "Sunday", open: "", close: "", isClosed: false, is24Hours: false },
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
    globalAddress: "",
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
    dispatch(getAllUsersClient())
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
    setDeleteDialog({ open: true, id: row.id, name: row.businessName }); // Added name for delete dialog
  };
  const confirmDelete = () => {
    if (deleteDialog.id) {
      dispatch(deleteBusinessList(deleteDialog.id)).then(() => {
        dispatch(getAllBusinessList());
      });
    }
    setDeleteDialog({ open: false, id: null, name: "" });
  };
  const resetForm = () => {
    setFormData({
      clientId: "",
      businessName: "",
      plotNumber: "",
      street: "",
      pincode: "",
      globalAddress: "",
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
    setActiveStep(0); // Reset step when form is cleared
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
    globalAddress: bl.globalAddress || "-",
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
    { field: "location", headerName: "Location", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "isActive", headerName: "Status", flex: 1 },

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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="form-input-group">
              <label htmlFor="clientId" className="input-label">Client ID</label>
              <select
                id="clientId"
                name="clientId"
                className={`select-input ${errors.clientId ? "error" : ""}`}
                value={formData.clientId}
                onChange={handleChange}
              >
                <option value="">-- Select Client --</option>
                {users.map((user) => (
                  <option key={user._id} value={user.clientId}>
                    {user.clientId} - {user.name}
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="error-text">{errors.clientId}</p>}
            </div>


            {/* Business Name */}
            <div className="form-input-group">
              <label htmlFor="businessName" className="input-label">Business Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                className={`text-input ${errors.businessName ? "error" : ""}`}
                value={formData.businessName}
                onChange={handleChange}
              />
              {errors.businessName && <p className="error-text">{errors.businessName}</p>}
            </div>

            {/* Plot Number */}
            <div className="form-input-group">
              <label htmlFor="plotNumber" className="input-label">Plot Number</label>
              <input
                type="text"
                id="plotNumber"
                name="plotNumber"
                className="text-input"
                value={formData.plotNumber}
                onChange={handleChange}
              />
            </div>

            {/* Street */}
            <div className="form-input-group">
              <label htmlFor="street" className="input-label">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                className="text-input"
                value={formData.street}
                onChange={handleChange}
              />
            </div>

            {/* Pincode */}
            <div className="form-input-group">
              <label htmlFor="pincode" className="input-label">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                className={`text-input ${errors.pincode ? "error" : ""}`}
                value={formData.pincode}
                onChange={handleChange}
              />
              {errors.pincode && <p className="error-text">{errors.pincode}</p>}
            </div>

            {/* Global Address */}
            <div className="form-input-group">
              <label htmlFor="address2" className="input-label">Global Address</label>
              <input
                type="text"
                id="globalAddress"
                name="globalAddress"
                className={`text-input ${errors.globalAddress ? "error" : ""}`}
                value={formData.globalAddress}
                onChange={handleChange}
              />
              {errors.globalAddress && <p className="error-text">{errors.globalAddress}</p>}
            </div>

            {/* Email */}
            <div className="form-input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`text-input ${errors.email ? "error" : ""}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Contact */}
            <div className="form-input-group">
              <label htmlFor="contact" className="input-label">Contact</label>
              <input
                type="text"
                id="contact"
                name="contact"
                className={`text-input ${errors.contact ? "error" : ""}`}
                value={formData.contact}
                onChange={handleChange}
              />
              {errors.contact && <p className="error-text">{errors.contact}</p>}
            </div>

            {/* Contact List */}
            <div className="form-input-group">
              <label htmlFor="contactList" className="input-label">Enquiry Number</label>
              <input
                type="text"
                id="contactList"
                name="contactList"
                className="text-input"
                value={formData.contactList}
                onChange={handleChange}
              />
            </div>

            {/* GSTIN */}
            <div className="form-input-group">
              <label htmlFor="gstin" className="input-label">GSTIN</label>
              <input
                type="text"
                id="gstin"
                name="gstin"
                className={`text-input ${errors.gstin ? "error" : ""}`}
                value={formData.gstin}
                onChange={handleChange}
              />
            </div>

            {/* Whatsapp Number */}
            <div className="form-input-group">
              <label htmlFor="whatsappNumber" className="input-label">Whatsapp Number</label>
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                className={`text-input ${errors.whatsappNumber ? "error" : ""}`}
                value={formData.whatsappNumber}
                onChange={handleChange}
              />
              {errors.whatsappNumber && <p className="error-text">{errors.whatsappNumber}</p>}
            </div>

            {/* Experience */}
            <div className="form-input-group">
              <label htmlFor="experience" className="input-label">Experience</label>
              <input
                type="text"
                id="experience"
                name="experience"
                className={`text-input ${errors.experience ? "error" : ""}`}
                value={formData.experience}
                onChange={handleChange}
              />
              {errors.experience && <p className="error-text">{errors.experience}</p>}
            </div>

            {/* Google Map */}
            <div className="form-input-group">
              <label htmlFor="googleMap" className="input-label">Google Map</label>
              <input
                type="text"
                id="googleMap"
                name="googleMap"
                className="text-input"
                value={formData.googleMap}
                onChange={handleChange}
              />
            </div>

            {/* Website */}
            <div className="form-input-group">
              <label htmlFor="website" className="input-label">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                className="text-input"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {/* Social Links */}
            {["facebook", "instagram", "youtube", "pinterest", "twitter", "linkedin"].map((field) => (
              <div className="form-input-group" key={field}>
                <label htmlFor={field} className="input-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  className="text-input"
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="form-input-group">
              <label htmlFor="location" className="input-label">Location</label>
              <select
                id="location"
                name="location"
                className={`select-input ${errors.location ? "error" : ""}`}
                value={formData.location}
                onChange={handleChange}
              >
                <option value="">-- Select Location --</option>
                {location.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {`${loc.addressLine1}, ${loc.city}, ${loc.district}, ${loc.state}, ${loc.country} (${loc.pincode})`}
                  </option>
                ))}
              </select>
              {errors.location && <p className="error-text">{errors.location}</p>}
            </div>


            {/* Category Select */}


            <div className="form-input-group col-span-all">
              <h3 style={{ marginBottom: "15px" }}>Opening Hours</h3>
              <div className="opening-hours-container">
                {formData.openingHours.map((hour, index) => (
                  <div
                    key={hour.day}
                    className="opening-hours-row"
                    data-closed={hour.isClosed}
                    data-247={hour.is24Hours}
                  >
                    {/* 1. Day Label */}
                    <div className="day-label">{hour.day}</div>

                    {/* 2. Time Group (Open/Close) */}
                    <div className="time-group">
                      <input
                        type="time"
                        value={hour.is24Hours ? "00:00" : hour.open}
                        onChange={(e) =>
                          handleOpeningHourChange(index, "open", e.target.value)
                        }
                        disabled={hour.isClosed || hour.is24Hours}
                        className="text-input"
                        placeholder="Open Time"
                      />
                      <input
                        type="time"
                        value={hour.is24Hours ? "23:59" : hour.close}
                        onChange={(e) =>
                          handleOpeningHourChange(index, "close", e.target.value)
                        }
                        disabled={hour.isClosed || hour.is24Hours}
                        className="text-input"
                        placeholder="Close Time"
                      />
                    </div>

                    {/* 3. Status Select */}
                    <div style={{ justifySelf: "end" }}>
                      <select
                        value={
                          hour.isClosed ? "closed" : hour.is24Hours ? "24/7" : "open"
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "closed") {
                            handleOpeningHourChange(index, "isClosed", true);
                            handleOpeningHourChange(index, "is24Hours", false);
                          } else if (value === "24/7") {
                            handleOpeningHourChange(index, "isClosed", false);
                            handleOpeningHourChange(index, "is24Hours", true);
                            handleOpeningHourChange(index, "open", "00:00");
                            handleOpeningHourChange(index, "close", "23:59");
                          } else {
                            handleOpeningHourChange(index, "isClosed", false);
                            handleOpeningHourChange(index, "is24Hours", false);
                          }
                        }}
                        className="select-input"
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="24/7">24/7</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

    case 1:
  return (
    <>
      <div className="form-input-group">
        <label htmlFor="category" className="input-label">Category</label>
        <select
          id="category"
          name="category"
          className={`select-input ${errors.category ? "error" : ""}`}
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">-- Select Category --</option>
          {category.map((cat) => (
            <option key={cat._id} value={cat.category}>{cat.category}</option>
          ))}
        </select>
        {errors.category && <p className="error-text">{errors.category}</p>}
      </div>

      {formData.category && (
        <div className="form-input-group">
          <label htmlFor="keywords" className="input-label">Select Keyword</label>
          <select
            id="keywords"
            name="keywords"
            className={`select-input ${errors.keywords ? "error" : ""}`}
            value={formData.keywords || ""}
            onChange={handleChange}
          >
            <option value="">-- Select Keyword --</option>
            {/* Find the selected category and render its keywords */}
            {category
              .find((cat) => cat.category === formData.category)
              ?.keywords?.map((kw, index) => (
                <option key={index} value={kw}>{kw}</option>
              ))}
          </select>
          {errors.keywords && <p className="error-text">{errors.keywords}</p>}
        </div>
      )}

      {/* OPTIONAL — RESTAURANT OPTIONS */}
      {["restaurants", "hotels"].includes(formData.category?.toLowerCase()) && (
        <div className="form-input-group">
          <label htmlFor="restaurantOptions" className="input-label">Restaurant Options</label>
          <select
            id="restaurantOptions"
            name="restaurantOptions"
            className={`select-input ${errors.restaurantOptions ? "error" : ""}`}
            value={formData.restaurantOptions || ""}
            onChange={handleChange}
          >
            <option value="">-- Select Option --</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Both">Both</option>
          </select>
          {errors.restaurantOptions && <p className="error-text">{errors.restaurantOptions}</p>}
        </div>
      )}
    </>
  );


      case 2:
        return (
          <>
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
                {preview && <Avatar src={preview} sx={{ width: 56, height: 56 }} className="preview-avatar" />}
              </div>
            </div>

            <div className="form-input-group col-span-all">
              <label className="input-label">Business Details</label>
              <ReactQuill
                theme="snow"
                value={businessvalue}
                onChange={handleBusinessChange}
                modules={modules}
                formats={formats}
                placeholder="Type business details here..."
                style={{ height: "200px" }}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };


  return (
    <div className="business-page">
      {/* ----------------------------------
        STEPPER INTEGRATION
        ---------------------------------- 
      */}
      <div className="business-card" style={{ marginBottom: '20px', padding: '15px 30px', boxShadow: 'none' }}>
        <Stack sx={{ width: '100%' }} spacing={4}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </div>

      {/* Business Form Card */}
      <div className="business-card form-section">
        <h2 className="card-title">
          {editMode ? `Edit Business (${steps[activeStep]})` : `Add New Business (${steps[activeStep]})`}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {renderStepContent(activeStep)}
          </div>

          <div className="col-span-all upload-section" style={{ display: 'flex', justifyContent: 'space-between', marginTop: activeStep !== 2 ? '28px' : '150px' }}>

            {activeStep > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="submit-button" onClick={handleBack}>
                  <SkipPreviousIcon />
                </button>
              </div>
            )}

            {activeStep < steps.length - 1 ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="submit-button" onClick={handleNext}>
                  <SkipNextIcon />
                </button>
              </div>

            ) : (
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
                style={{ marginLeft: 'auto' }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : editMode ? (
                  "Update Business"
                ) : (
                  "Create Business"
                )}
              </button>
            )}

          </div>
        </form>
      </div>

      {/* Business Table */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          BusinessList Table
        </Typography>
        <Box sx={{ height: 500, width: "100%" }}>
          <CustomizedDataGrid rows={rows} columns={businessListTable} />
        </Box>
      </Paper>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: "" })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{deleteDialog.name || "this business"}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: "" })} color="secondary">
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={galleryDialog.open} onClose={handleCloseGallery} maxWidth="md" fullWidth>
        <DialogTitle>Gallery - {galleryDialog.data?.businessName}</DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {galleryDialog.data?.businessImages?.map((img, idx) => <Avatar key={idx} src={img} sx={{ width: 100, height: 100 }} />)}
            {newGalleryImages.map((img, idx) => <Avatar key={idx} src={img} sx={{ width: 100, height: 100, border: "2px dashed green" }} />)}
          </div>
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Images
            <input type="file" hidden multiple accept="image/*" onChange={handleGalleryImageChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGallery} color="secondary">Close</Button>
          <Button onClick={handleUploadGalleryImages} color="primary" variant="contained" disabled={newGalleryImages.length === 0}>Upload</Button>
        </DialogActions>
      </Dialog>
    </div>

  );
}