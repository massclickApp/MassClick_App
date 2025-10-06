import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import CardsSearch from '../CardsSearch/CardsSearch';
import CardDesign from '../cards/cards.js'; // <-- import your reusable card component
import './SearchResult.css'; // optional if you have styles

const SearchResults = () => {
    const { location: locParam, category: catParam, searchTerm: termParam } = useParams();
    const locationState = useLocation();
    const results = locationState.state?.results || [];

    // Helper function to handle image sources (base64 or URL)
    const buildImageSrc = (bannerImage) => {
        if (!bannerImage) return 'https://via.placeholder.com/120x100?text=Logo';
        return bannerImage.startsWith('data:image')
            ? bannerImage
            : `data:image/png;base64,${bannerImage}`;
    };

    return (
        <>
            {/* 🔍 Top Search Bar */}
            <CardsSearch />

            <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fb', pt: 4, pb: 6 }}>
                <Box sx={{ maxWidth: '1200px', margin: 'auto', p: 2 }}>
                    {/* 🧩 Business Cards List */}
                    {results.length === 0 ? (
                        <Card
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                No businesses found matching your criteria.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Please try broadening your search or use other filters.
                            </Typography>
                        </Card>
                    ) : (
                        <div className="restaurants-list-wrapper">
                            {results.map((business) => {
                                const imageSource = buildImageSrc(business.bannerImage);

                                return (
                                    <CardDesign
                                        key={business._id}
                                        title={business.businessName}
                                        phone={business.contact}
                                        whatsapp={business.whatsappNumber}
                                        address={`${business.plotNumber ? business.plotNumber + ', ' : ''}${business.street}, ${business.location}, Pincode: ${business.pincode}`}
                                        details={`Experience: ${business.experience || 'N/A'} | Category: ${business.category || 'N/A'}`}
                                        imageSrc={imageSource}
                                        rating={business.rating || '4.5'}
                                        reviews={business.reviews || '250'}
                                        to={`/business/${business._id}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default SearchResults;
