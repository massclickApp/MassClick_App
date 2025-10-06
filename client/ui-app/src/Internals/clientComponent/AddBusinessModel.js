import React from "react";
import {
    Dialog,
    DialogContent,
    Button,
    Typography,
    Box,
    TextField,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    Link,
    Grid,
    useMediaQuery,
    useTheme,
} from "@mui/material";

// --- Logo Component for Clean Branding ---
const LogoComponent = () => (
    <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
                fontWeight: 800, 
                // A slightly deeper, more professional orange for the logo
                color: '#E65100', 
            }}
        >
            MassClick<sup style={{ fontSize: '0.5em', ml: '2px' }}>TM</sup>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
            India's Leading Local Search Engine
        </Typography>
    </Box>
);

// --- Main OTP Login Modal Component ---
const OTPLoginModal = ({ open, handleClose }) => {
    const theme = useTheme();
    // Check for mobile size to apply full-screen design
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
    
    const [mobileNumber, setMobileNumber] = React.useState('');
    const [agreed, setAgreed] = React.useState(false);

    const handleLogin = () => {
        if (agreed && mobileNumber.length === 10) {
            console.log("Attempting to log in with number:", mobileNumber);
            // In a real app, you would dispatch a Thunk or call an API here
        } else {
            console.log("Please agree to terms and enter a valid mobile number.");
        }
        handleClose()
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm" 
            fullScreen={isMobile} 
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: isMobile ? '0' : "24px", // Sharper corners for a modern look
                    boxShadow: isMobile ? 'none' : "0 15px 40px rgba(0, 0, 0, 0.15)",
                    // Responsive padding: smaller on mobile, larger on desktop
                    p: { xs: 2, sm: 4 }, 
                    minHeight: '400px',
                    backgroundColor: theme.palette.grey[50], // Very light off-white background
                },
            }}
        >
            <DialogContent 
                sx={{ 
                    p: 0, // Remove default dialog content padding
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100%',
                }}
            >
                
                {/* Logo Section */}
                <LogoComponent />
                
                {/* Welcome Text */}
                <Typography 
                    variant="h5" 
                    sx={{ 
                        mt: 1, 
                        fontWeight: 700, 
                        color: theme.palette.text.primary 
                    }}
                >
                    Welcome Back!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Login for a seamless experience
                </Typography>

                {/* Mobile Number Input with International Styling */}
                <TextField
                    fullWidth
                    placeholder="Enter Mobile Number*"
                    required
                    variant="outlined"
                    type="tel"
                    inputProps={{ maxLength: 10 }}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ 
                                bgcolor: theme.palette.grey[200], // Light grey background for the prefix
                                p: 2,
                                borderRight: `1px solid ${theme.palette.grey[300]}`,
                                margin: '-8px 8px -8px -14px', // Adjust margin to integrate into the field
                                borderRadius: '4px 0 0 4px',
                                height: 'calc(100% + 16px)'
                            }}>
                                <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    +91
                                </Typography>
                            </InputAdornment>
                        ),
                        sx: { 
                            borderRadius: "12px", // Highly rounded corners for modern inputs
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            // Ensure the input field itself has padding
                            '& .MuiInputBase-input': { 
                                py: '16.5px', // Match standard height
                            }
                        }
                    }}
                    sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[400] },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                    }}
                />
                
                {/* Mandatory Fields Caption - Aligned left */}
                <Typography variant="caption" color="text.secondary" alignSelf="flex-start" sx={{ ml: 1, mb: 1.5, fontStyle: 'italic' }}>
                    * indicates mandatory fields
                </Typography>

                {/* Terms and Privacy Section */}
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4, width: '100%' }}>
                    {/* Checkbox */}
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={agreed} 
                                    onChange={(e) => setAgreed(e.target.checked)} 
                                    name="terms" 
                                    size="small"
                                    sx={{ 
                                        color: theme.palette.grey[500],
                                        '&.Mui-checked': { 
                                            color: '#FF6F00' // Highlighting the checked state
                                        } 
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2" color="text.secondary">
                                    I Agree to <Link href="#" underline="hover" sx={{ color: '#FF6F00', fontWeight: 600 }}>Terms and Conditions</Link>
                                </Typography>
                            }
                            sx={{ mr: 0 }}
                        />
                    </Grid>
                    
                    {/* Privacy Policy Link - Aligned right */}
                    <Grid item>
                        <Link href="#" underline="hover" variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            T&C's Privacy Policy
                        </Link>
                    </Grid>
                </Grid>


                {/* Login Button - High Impact */}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    disabled={!agreed || mobileNumber.length < 10}
                    sx={{
                        // Richer, smoother gradient for an international feel
                        background: "linear-gradient(90deg, #FF9900 0%, #FF6F00 100%)",
                        color: "white",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        borderRadius: "30px",
                        py: 1.5,
                        // Stronger, more elegant box shadow
                        boxShadow: "0 8px 25px rgba(255, 123, 0, 0.5)",
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        "&:hover": {
                            background: "linear-gradient(90deg, #FF6F00 0%, #FF9900 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 30px rgba(255, 123, 0, 0.6)",
                        },
                        "&.Mui-disabled": {
                            background: theme.palette.grey[300],
                            color: theme.palette.grey[500],
                            boxShadow: 'none',
                        }
                    }}
                >
                    Login With OTP
                </Button>

                {/* May Be Later link - Subtle */}
                <Link 
                    component="button" 
                    variant="body2" 
                    onClick={handleClose} 
                    sx={{ 
                        mt: 2, 
                        color: theme.palette.grey[600], 
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        '&:hover': {
                            color: '#FF6F00',
                        }
                    }}
                >
                    May be Later
                </Link>

            </DialogContent>
        </Dialog>
    );
};

export default OTPLoginModal;