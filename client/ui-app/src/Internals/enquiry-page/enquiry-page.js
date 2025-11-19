import React, { useEffect, useState } from "react";
import './enquiry-page.css';
import { useDispatch, useSelector } from "react-redux";
import { getAllStartProjects, editStartProject } from "../../redux/actions/startProjectAction.js";

export default function EnquiryPage() {

    const dispatch = useDispatch();

    const { projects = [], loading } = useSelector(
        (state) => state.startProjectReducer || {}
    );

    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleView = (item) => {
        setSelectedEnquiry(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedEnquiry(null);
        setOpenModal(false);
    };

    const handleCloseEnquiry = (item) => {
        dispatch(editStartProject(item._id, { isActive: false }))
            .then(() => dispatch(getAllStartProjects()))
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        dispatch(getAllStartProjects());
    }, [dispatch]);

    const activeEnquiries = projects.filter((p) => p.isActive === true);

    return (
        <div className="business-enquiry-container">

            <h2 className="business-enquiry-title">
                Business Enquiries ({activeEnquiries.length})
            </h2>

            <div className="business-enquiry-card-list">
                {activeEnquiries.map((item) => (
                    <div key={item._id} className="business-enquiry-card">

                        <div className="business-enquiry-header">

                            <h3 className="business-enquiry-name">
                                {item.fullName}
                                {item.businessName ? ` (${item.businessName})` : ""}
                            </h3>

                            <div className="business-enquiry-btn-row">
                                <button
                                    className="business-enquiry-view-btn"
                                    onClick={() => handleView(item)}
                                >
                                    View
                                </button>

                                <button
                                    className="business-enquiry-close-btn"
                                    onClick={() => handleCloseEnquiry(item)}
                                >
                                    Close
                                </button>
                            </div>

                        </div>

                        <p className="business-enquiry-text">
                            <strong>Message:</strong> {item.message}
                        </p>

                        <p className="business-enquiry-text">
                            <strong>Phone:</strong> {item.contactNumber}
                        </p>

                        <p className="business-enquiry-text">
                            <strong>Email:</strong> {item.email}
                        </p>

                        <p className="business-enquiry-text">
                            <strong>Location:</strong> {item.city}, {item.state}
                        </p>

                        <p className="business-enquiry-text">
                            <strong>Date:</strong> {new Date(item.submittedAt).toLocaleDateString()}
                        </p>

                    </div>
                ))}
            </div>

            {openModal && selectedEnquiry && (
                <div className="modal-overlay" onClick={handleCloseModal}>

                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                        <h2 className="modal-title">Enquiry Details</h2>

                        <div className="modal-content">

                            <p><strong>Full Name:</strong> {selectedEnquiry.fullName}</p>
                            <p><strong>Business Name:</strong> {selectedEnquiry.businessName}</p>
                            <p><strong>Business Type:</strong> {selectedEnquiry.businessType}</p>
                            <p><strong>Category:</strong> {selectedEnquiry.category}</p>
                            <p><strong>Sub Category:</strong> {selectedEnquiry.subCategory}</p>

                            <p><strong>Message:</strong> {selectedEnquiry.message}</p>
                            <p><strong>Phone:</strong> {selectedEnquiry.contactNumber}</p>
                            <p><strong>Email:</strong> {selectedEnquiry.email}</p>
                            <p><strong>Business Phone:</strong> {selectedEnquiry.businessPhone}</p>

                            <p><strong>Address:</strong> {selectedEnquiry.address}</p>
                            <p><strong>City:</strong> {selectedEnquiry.city}</p>
                            <p><strong>State:</strong> {selectedEnquiry.state}</p>
                            <p><strong>Country:</strong> {selectedEnquiry.country}</p>
                            <p><strong>Pincode:</strong> {selectedEnquiry.postalCode}</p>

                            <p><strong>Notes:</strong> {selectedEnquiry.notes}</p>

                            <p>
                                <strong>Submitted At:</strong>{" "}
                                {new Date(selectedEnquiry.submittedAt).toLocaleString()}
                            </p>

                        </div>

                        <button className="modal-close-btn" onClick={handleCloseModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
