// Profile.js (Updated with Full-Width Content and More Fields)
import React, { useEffect } from "react";
import './profile.css';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'; // For User ID
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'; // For Date Joined
import GpsFixedRoundedIcon from '@mui/icons-material/GpsFixedRounded'; // For Role ID
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'; // For Full Address
import { getAllUsers } from "../../../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";


export default function Profile() {
    const authUser = useSelector(state => state.auth.user);
    const authLoading = useSelector(state => state.auth.loading);
    const dispatch = useDispatch();


    const { users = [], loading: userLoading } = useSelector((state) => state.userReducer || {});
    // console.log("userss", users); // Console logs removed for cleaner code presentation

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const currentAuthId = authUser?.userId || authUser?._id || authUser?._id?.$oid;
    // console.log("currentAuthId", currentAuthId); // Console logs removed

    const fullProfile = users.find(u => {
        const listUserId = u._id?.$oid || u._id || u.userId;
        return listUserId === currentAuthId;
    });
    // console.log("fullProfile", fullProfile); // Console logs removed



    const user = fullProfile || authUser;
    const loading = authLoading || userLoading;

    const profileImageUrl = user?.userProfile
        ? user.userProfile
        : 'https://via.placeholder.com/150/007bff/ffffff?text=U';

    if (loading) {
        return <div className="loading">Loading Profile...</div>;
    }

    if (!user) {
        return (
            <div className="profilePage">
                <div className="profileCard">
                    <h1 className="title">User Profile</h1>
                    <p className="noData">Please log in to view your profile details.</p>
                </div>
            </div>
        );
    }

    // Extracting and preparing data for new fields
    const {
        userName,
        contact,
        role,
        businessLocation,
        businessCategory,
        emailId,
        roleId,
        createdAt // Assuming a createdAt field exists for date joined
    } = user;

    // Derive User ID: Use currentAuthId, which is the most reliable ID found
    const userIdDisplay = currentAuthId || 'N/A';
    // Format Date: Convert ISO string to a readable format
    const dateJoined = createdAt
        ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : 'N/A';
    // Example full address (You need to adjust this based on your actual user object structure)
    const fullAddress = user.address?.full || `${user.addressLine1 || ''} ${user.city || ''} ${user.state || ''} ${user.zipCode || ''}`.trim() || 'No full address available';


    return (
        <div className="profilePage">
            <div className="profileCard">

                <div className="header">
                    <img
                        src={profileImageUrl}
                        alt={`${user.userName}'s Profile`}
                        className="avatar"
                    />
                    <h1 className="userName">{user.userName || 'N/A'}</h1>
                    <span className="roleTag"><BadgeRoundedIcon sx={{ fontSize: '1.1rem', mr: 0.5 }} /> {user.role || 'N/A'}</span>
                </div>

                <div className="mainContentLayout">

                    <div className="section">
                        <h2 className="sectionTitle">Personal Contact</h2>
                        <div className="detailsGrid">
                            <div className="detailItem">
                                <EmailRoundedIcon className="icon" />
                                <div className="detailContent">
                                    <span className="detailLabel">Email Address</span>
                                    <span className="detailValue">{user.emailId || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="detailItem">
                                <PhoneRoundedIcon className="icon" />
                                <div className="detailContent">
                                    <span className="detailLabel">Primary Contact No.</span>
                                    <span className="detailValue">{user.contact || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- COLUMN 2: BUSINESS INFORMATION --- */}
                    <div className="section">
                        <h2 className="sectionTitle">Business Information</h2>
                        <div className="detailsGrid">
                            <div className="detailItem">
                                <BusinessCenterRoundedIcon className="icon" />
                                <div className="detailContent">
                                    <span className="detailLabel">Business Category</span>
                                    <span className="detailValue">{user.businessCategory || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="detailItem">
                                <LocationOnRoundedIcon className="icon" />
                                <div className="detailContent">
                                    <span className="detailLabel">Primary Location</span>
                                    <span className="detailValue">{user.businessLocation || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- COLUMN 3: SYSTEM/ADMIN DETAILS --- */}
                    <div className="section">
                        <h2 className="sectionTitle">System & Admin</h2>
                        <div className="detailsGrid">
                            <div className="detailItem">
                                <VpnKeyRoundedIcon className="icon" />
                                <div className="detailContent">
                                    <span className="detailLabel">System User ID</span>
                                    <span className="detailValue">{userIdDisplay}</span>
                                </div>
                            </div>
                            <div className="detailItem">
                                <CalendarMonthRoundedIcon className="icon" />
                                <div className="detailContent">
                                    <span className="detailLabel">Date Joined</span>
                                    <span className="detailValue">{dateJoined}</span>
                                </div>
                            </div>
                            <div className="detailItem">
                                <GpsFixedRoundedIcon className="icon" />
                                <div className="detailContent">
                                    <span className="detailLabel">Role ID</span>
                                    <span className="detailValue">{user.roleId || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- FULL ADDRESS SECTION (Spans all columns on large screens) --- */}
                    <div className="section full-section-span">
                        <h2 className="sectionTitle">Full Registered Address</h2>
                        <div className="detailsGrid">
                            <div className="detailItem">
                                <HomeRoundedIcon className="icon" />
                                <div className="detailContent">
                                    <span className="detailLabel">Complete Address</span>
                                    <span className="detailValue">{fullAddress}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <p className="footerNote">Profile data displayed as of {new Date().toLocaleDateString()}.</p>
        </div>
    );
}