import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Crave it? <br />
            <span className="text-gradient">We SwiftServe it.</span>
          </h1>
          <p className="hero-subtitle">
            Experience the fastest food delivery from your favorite local restaurants. 
            Hot, fresh, and right to your door.
          </p>
          <div className="hero-actions">
            <Link to="/restaurants" className="btn btn-primary btn-lg">
              Order Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-blob"></div>
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
              alt="Delicious Food" 
              className="hero-image"
            />
          </div>
        </div>
      </section>
      
      <section className="features-section container">
        <h2 className="section-title">Why Choose SwiftServe?</h2>
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Our routing algorithm ensures your food arrives hot and fresh.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon">🍔</div>
            <h3>Best Restaurants</h3>
            <p>Curated selection of top-rated local dining spots.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Ordering</h3>
            <p>End-to-end encrypted payments and live order tracking.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
