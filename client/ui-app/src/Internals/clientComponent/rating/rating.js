import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch } from 'react-redux';
import { editBusinessList } from '../../../redux/actions/businessListAction';

const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

export default function UserRatingWidget({ 
    businessId,
     initialValue = 0, 
     currentRatings = [] 
}) {
    const dispatch = useDispatch();

    const [value, setValue] = React.useState(initialValue);
    const [hover, setHover] = React.useState(-1);

    const handleRatingChange = async (event, newValue) => {
        if (!newValue) return;

        setValue(newValue);
        console.log(`User rated business ${newValue} stars.`);

        try {
            const updatedRatings = [...currentRatings, newValue];

            const averageRating =
                updatedRatings.reduce((sum, rating) => sum + rating, 0) / updatedRatings.length;

            await dispatch(
                editBusinessList(businessId, {
                    ratings: updatedRatings,
                    averageRating,
                })
            );

            console.log("Rating updated successfully.");
        } catch (err) {
            console.error("Error updating rating:", err);
        }
    };
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Click to Rate</p>
            <Rating
                name="user-rating-input"
                value={value}
                precision={0.5}
                onChange={handleRatingChange}

                onChangeActive={(event, newHover) => setHover(newHover)}

                emptyIcon={<StarIcon style={{ opacity: 0.2 }} fontSize="inherit" />}
                size="large"
            />

            {value !== null && (
                <Box sx={{ mt: 1, fontSize: '14px', color: '#1a73e8' }}>
                    {labels[hover !== -1 ? hover : value] || 'Rate Now'}
                </Box>
            )}
        </Box>
    );
}