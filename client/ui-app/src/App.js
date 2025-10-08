import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { relogin } from './redux/actions/authAction.js';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './Internals/clientComponent/theme.js';

import Dashboard from './Dashboard';
import Login from './Internals/Login/login.js';
import User from './Internals/user/Users.js';
import Clients from './Internals/clients/Client.js';
import Business from './Internals/business/Business.js';
import Category from './Internals/categories/Category.js';
import Roles from './Internals/Roles/Roles.js';
import Location from './Internals/location/Location.js';
import MainGrid from './components/MainGrid.js';
import PrivateRoute from './PrivateRoute';
import BusinessListing from './Internals/clientComponent/home.js';
import { featuredServices } from './Internals/clientComponent/featureService.js';
import { SnackbarProvider } from 'notistack';
import SearchResults from './Internals/clientComponent/SearchResult/SearchResult.js';
import { categoriesServices } from './Internals/clientComponent/serviceCard.js';
import TrendingCards from './Internals/clientComponent/trendingSearch/trendingCard.js';
import BusinessDetails from './Internals/clientComponent/cards/cardDetails.js';
import AboutUsPage from './Internals/clientComponent/footer/aboutUs/aboutUsPage.js';
import Testimonials from './Internals/clientComponent/footer/testimonials/testimonials.js';
import FeedbackComponent from './Internals/clientComponent/footer/feedback/feedback.js';
import CustomerCareComponent from './Internals/clientComponent/footer/customerCare/customerCare.js';
import Portfolio from './Internals/clientComponent/footer/portfolio/portfolio.js';
import TermsAndConditions from './Internals/clientComponent/footer/termsAndConditions/termsAndCondition.js';
import PrivacyPolicy from './Internals/clientComponent/footer/privacyPolicy/privacyPolicy.js';
import RefundPolicy from './Internals/clientComponent/footer/refund/refundPolicy.js';
import EnquiryNow from './Internals/clientComponent/footer/enquiry/enquiry.js';
import WebDevSection from './Internals/clientComponent/footer/webDev/webDevSection.js';
import DigitalMarketing from './Internals/clientComponent/footer/digitalMarketing/digitalMarketing.js';
import GraphicDesign from './Internals/clientComponent/footer/graphicDesign/graphicDesign.js';
import Seo from './Internals/clientComponent/footer/seo/seo.js';


const ComingSoon = ({ title }) => (
  <div style={{ textAlign: 'center', marginTop: '20%' }}>
    <h2>{title} Page Coming Soon!</h2>
  </div>
);

const FooterRoutes = [
    { path: 'aboutus', title: 'About Us', element: <AboutUsPage /> }, 
    { path: 'testimonials', title: 'Testimonials', element: <Testimonials /> },
    { path: 'feedbacks', title: 'Feedbacks', element: <FeedbackComponent /> },
    { path: 'customercare', title: 'Customer Care', element: <CustomerCareComponent /> },
    { path: 'portfolio', title: 'Portfolio', element: <Portfolio />  },
    { path: 'terms', title: 'Terms and Conditions', element: <TermsAndConditions />  },
    { path: 'privacy', title: 'Privacy Policy' , element: <PrivacyPolicy />},
    { path: 'refund', title: 'Refund Policy' , element: <RefundPolicy /> },
    { path: 'enquiry', title: 'Enquiry Now', element: <EnquiryNow /> },
    { path: 'services/web', title: 'Web Design & Development' , element: <WebDevSection />},
    { path: 'services/digital', title: 'Digital Marketing' , element: <DigitalMarketing />},
    { path: 'services/graphic', title: 'Graphic Design', element: <GraphicDesign /> },
    { path: 'services/seo', title: 'SEO', element: <Seo /> },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      try {
        const result = await dispatch(relogin());
        if (result && result.accessToken) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (err) {
        console.warn("Invalid refresh token, clearing storage");
        localStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    initAuth();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={5000}
        preventDuplicate
      >
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
            <Route path="home" element={<BusinessListing />} />
             {FooterRoutes.map((route) => (
                <Route 
                    key={route.path} 
                    path={route.path} 
                    element={route.element || <ComingSoon title={route.title} />} 
                />
            ))}
            <Route path="/:location/:category/:searchTerm" element={<SearchResults />} />
            <Route path="/trending/:categorySlug" element={<TrendingCards />} />
            
            {featuredServices.map((service) => {
              const Component = service.component || (() => <ComingSoon title={service.name} />);
              return <Route key={service.path} path={service.path} element={<Component />} />;
            })}
            <Route path="/business/:id" element={<BusinessDetails />} />

            {categoriesServices.flatMap((category) =>
              category.items.map((item) => {
                const path = item.path || item.route;
                const Component = item.component || (() => <ComingSoon title={item.name} />);
                return <Route key={path} path={path} element={<Component />} />;
              })
            )}


            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<MainGrid />} />
                <Route path="user" element={<User />} />
                <Route path="clients" element={<Clients />} />
                <Route path="business" element={<Business />} />
                <Route path="category" element={<Category />} />
                <Route path="location" element={<Location />} />
                <Route path="roles" element={<Roles />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;