import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMRP } from '../../redux/actions/mrpAction';
import './mrpData.css';

export default function MRPDatas() {
  const dispatch = useDispatch();
  const { mrpList = [] } = useSelector(state => state.mrp || {});
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    dispatch(getAllMRP());
  }, [dispatch]);

  const toggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="mrp-admin-wrap">

      <div className="mrp-admin-title">
        <h1>MRP Responses</h1>
        <p>All published business requirements</p>
      </div>

      <div className="mrp-response-grid">
        {mrpList.map(item => {
          const isOpen = openId === item._id;

          return (
            <div
              key={item._id}
              className={`mrp-response-card ${isOpen ? 'expanded' : ''}`}
              onClick={() => toggle(item._id)}
            >
              <div className="mrp-card-top">
                <span className="mrp-badge">{item.categoryId}</span>

                <h3>{item.description}</h3>

                <p className="mrp-location">📍 {item.location}</p>

                <div className="mrp-meta">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="active">Active</span>
                </div>

                <div className="mrp-contact">
                  📞 {item.contactDetails}
                </div>
              </div>

              <div className="mrp-expand">
                {item.businessSnapshot && (
                  <>
                    <h4>Business Snapshot</h4>

                    <div className="snap">
                      <label>Name</label>
                      <span>{item.businessSnapshot.businessName}</span>
                    </div>

                    <div className="snap">
                      <label>Category</label>
                      <span>{item.businessSnapshot.category}</span>
                    </div>

                    <div className="snap">
                      <label>Location</label>
                      <span>{item.businessSnapshot.location}</span>
                    </div>

                    <div className="snap">
                      <label>Contact</label>
                      <span>{item.businessSnapshot.contact}</span>
                    </div>

                    <div className="snap">
                      <label>Email</label>
                      <span>{item.businessSnapshot.email}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
