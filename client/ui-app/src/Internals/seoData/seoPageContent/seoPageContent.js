import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    viewAllSeoPageContent,
    createSeoPageContent,
    updateSeoPageContent,
    deleteSeoPageContent,
} from "../../../redux/actions/seoPageContentAction.js";

import {
    Box,
    Typography,
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import CustomizedTable from "../../../components/Table/CustomizedTable.js";
import "./seoPageContent.css";

export default function SeoPageContent() {
    const dispatch = useDispatch();

    const seoPageContentState = useSelector(
        (state) => state.seoPageContentReducer
    );

    const {
        list = [],
        total = 0,
        loading = false,
    } = seoPageContentState || {};


    const [formData, setFormData] = useState({
        pageType: "",
        category: "",
        location: "",
        headerContent: "",
        pageContent: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
    ];

    useEffect(() => {
        dispatch(viewAllSeoPageContent());
    }, [dispatch]);

    const validateForm = () => {
        const e = {};
        if (!formData.pageType.trim()) e.pageType = "Required";
        if (!formData.category.trim()) e.category = "Required";
        if (!formData.location.trim()) e.location = "Required";
        if (!formData.headerContent.trim()) e.headerContent = "Required";
        if (!formData.pageContent.trim()) e.pageContent = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const action = editingId
            ? updateSeoPageContent(editingId, formData)
            : createSeoPageContent(formData);

        dispatch(action).then(() => {
            setFormData({
                pageType: "",
                category: "",
                location: "",
                headerContent: "",
                pageContent: "",
            });
            setEditingId(null);
            setErrors({});
            dispatch(viewAllSeoPageContent());
        });
    };

    const rows = list.map((seo) => ({
        id: seo._id,
        pageType: seo.pageType,
        category: seo.category,
        location: seo.location,
        headerContent: seo.headerContent,
        pageContent: seo.pageContent,
    }));

    const columns = [
        { id: "pageType", label: "Page Type" },
        { id: "category", label: "Category" },
        { id: "location", label: "Location" },

        {
            id: "action",
            label: "Action",
            renderCell: (_, row) => (
                <>
                    <IconButton
                        onClick={() => {
                            setEditingId(row.id);
                            setFormData(row);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        <EditRoundedIcon />
                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={() => {
                            setSelectedRow(row);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <DeleteOutlineRoundedIcon />
                    </IconButton>
                </>
            ),
        },
    ];


    return (
        <div className="seo-shell">
            <div className="seo-container">
                <header className="seo-header">
                    <h1>{editingId ? "Edit Page Content" : "Create Page Content"}</h1>
                    <p>Manage structured SEO page content</p>
                </header>
                <form className="seo-form" onSubmit={handleSubmit}>
                    <section className="meta-card">
                        <div className="meta-field">
                            <label>Page Type</label>
                            <input
                                value={formData.pageType}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, pageType: e.target.value }))
                                }
                            />
                            {errors.pageType && <span>{errors.pageType}</span>}
                        </div>

                        <div className="meta-field">
                            <label>Category</label>
                            <input
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, category: e.target.value }))
                                }
                            />
                            {errors.category && <span>{errors.category}</span>}
                        </div>
                        <div className="meta-field">
                            <label>Location</label>
                            <input
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, location: e.target.value }))
                                }
                            />
                            {errors.location && <span>{errors.location}</span>}
                        </div>
                    </section>

                    <section className="editor-card">
                        <div className="editor-title">
                            <h3>Header Content</h3>
                        </div>
                        <div className="editor-wrapper">
                            <ReactQuill
                                value={formData.headerContent}
                                onChange={(v) =>
                                    setFormData((p) => ({ ...p, headerContent: v }))
                                }
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                    </section>

                    <section className="editor-card">
                        <div className="editor-title">
                            <h3>Page Content</h3>
                        </div>
                        <div className="editor-wrapper">
                            <ReactQuill
                                value={formData.pageContent}
                                onChange={(v) =>
                                    setFormData((p) => ({ ...p, pageContent: v }))
                                }
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                    </section>

                    <div className="action-bar">
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <CircularProgress size={22} />
                            ) : editingId ? (
                                "Update Content"
                            ) : (
                                "Publish Content"
                            )}
                        </button>
                    </div>
                </form>

                <Box sx={{ mt: 6 }}>
                    <CustomizedTable
                        data={rows}
                        columns={columns}
                        total={total}
                        fetchData={(p, s) =>
                            dispatch(viewAllSeoPageContent({ pageNo: p, pageSize: s }))
                        }
                    />
                </Box>

                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this content?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() =>
                                dispatch(deleteSeoPageContent(selectedRow.id)).then(() => {
                                    setDeleteDialogOpen(false);
                                    dispatch(viewAllSeoPageContent());
                                })
                            }
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
