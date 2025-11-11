
import CardsSearch from '../../CardsSearch/CardsSearch'
import Footer from '../../footer/footer'
import './BusinessList.css'
export default function BusinessListPage() {

    const handlePayNow = () => {
    // In a real application, this would trigger the PhonePe (or other payment gateway) SDK
    // Example:
    console.log("Initiating payment via PhonePe for MassClick Business Listing...");
    alert("Redirecting to PhonePe for secure payment...");
    // window.location.href = "YOUR_PHONEPE_PAYMENT_URL"; 
    // Or, call a backend API that initiates the PhonePe flow.
  };
  return (
  <>
  <CardsSearch /><br/><br/><br/>
      <div className="cta-page-container">
        <div className="listing-cta-card">
          <h3 className="cta-title">List Your Business on</h3>
          <h2 className="cta-brand">MassClick</h2>

          <div className="cta-price-details">
            <p className="cta-price-value">Just <span className="currency">₹</span> 99/-</p>
            <p className="cta-tax-info">+ GST</p>
          </div>

          <button
            onClick={handlePayNow}
            className="btn-pay-now"
          >
            Pay Now
          </button>

          <p className="payment-note">Secure payment powered by PhonePe & other gateways.</p>
        </div>
      </div>    
      <Footer />
      </>
  )
}