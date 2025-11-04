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
    
 const createSlug = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };
    return (
        <>
            <CardsSearch /><br /><br /><br />

            <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fb', pt: 4, pb: 6 }}>
                <Box sx={{ maxWidth: '1200px', margin: 'auto', p: 2 }}>
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
                                const averageRating = business.averageRating?.toFixed(1) || 0;
                                const totalRatings = business.reviews?.length || 0;

                                const nameSlug = createSlug(business.businessName);
                                const locationSlug = createSlug(business.locationDetails || 'unknown');
                                const address = createSlug(business.street || 'unknown');
                                return (
                                    <CardDesign
                                        key={business._id}
                                        title={business.businessName}
                                        phone={business.contact}
                                        whatsapp={business.whatsappNumber}
                                        address={`${business.locationDetails}`}
                                        details={`Experience: ${business.experience || 'N/A'} | Category: ${business.category || 'N/A'}`}
                                        imageSrc={business.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
                                        rating={averageRating}
                                        reviews={totalRatings}
                                        to={`/${locationSlug}/${nameSlug}/${address}/${business._id}`}
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
