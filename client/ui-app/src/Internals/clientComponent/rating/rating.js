import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch } from 'react-redux';
// import { editBusinessList } from '../../../redux/actions/businessListAction';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate

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
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // <-- Initialize useNavigate

    const [value, setValue] = React.useState(initialValue);
    const [hover, setHover] = React.useState(-1);

        const handleRatingChange = (event, newValue) => {
        if (!newValue) return;

        // 1. Update local state to show the user their selection instantly
        setValue(newValue);

        // 2. Redirect the user to the new review page
        // We pass the businessId and the selected rating value (e.g., 3.5)
        navigate(`/write-review/${businessId}/${newValue}`);
        
        // The Redux update (editBusinessList) will now happen on the /write-review page
        // when the user clicks 'Submit' there.
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