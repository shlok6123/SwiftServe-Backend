import { ArrowRight, Zap, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import './Home.css';

const Home = () => {
  const revealRef = useScrollReveal();

  return (
    <div className="home-container" ref={revealRef}>
      <section className="hero-section">
        <div className="particles" aria-hidden="true">
          <span style={{ left: '8%', animationDelay: '0s' }} />
          <span style={{ left: '20%', animationDelay: '1.5s' }} />
          <span style={{ left: '34%', animationDelay: '3s' }} />
          <span style={{ left: '48%', animationDelay: '0.8s' }} />
          <span style={{ left: '62%', animationDelay: '2.2s' }} />
          <span style={{ left: '76%', animationDelay: '4s' }} />
          <span style={{ left: '88%', animationDelay: '1s' }} />
        </div>
        <div className="hero-content">
          <span className="hero-eyebrow anim-fade-down">⚡ Fast. Fresh. Delivered.</span>
          <h1 className="hero-title anim-fade-up">
            Crave it? <br />
            <span className="text-gradient-animated">We SwiftServe it.</span>
          </h1>
          <p className="hero-subtitle anim-fade-up delay-1">
            Experience the fastest food delivery from your favorite local restaurants. 
            Hot, fresh, and right to your door.
          </p>
          <div className="hero-actions anim-fade-up delay-2">
            <Link to="/restaurants" className="btn btn-primary btn-lg shine">
              Order Now <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Join SwiftServe
            </Link>
          </div>

          <div className="hero-stats anim-fade-up delay-3">
            <div className="stat">
              <span className="stat-num text-gradient">500+</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat">
              <span className="stat-num text-gradient">20min</span>
              <span className="stat-label">Avg. Delivery</span>
            </div>
            <div className="stat">
              <span className="stat-num text-gradient">50k+</span>
              <span className="stat-label">Happy Foodies</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-blob"></div>
          <div className="hero-image-wrapper anim-scale-in anim-float">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
              alt="Delicious Food" 
              className="hero-image"
            />
          </div>
        </div>
      </section>
      
      <section className="features-section container">
        <h2 className="section-title reveal">Why Choose SwiftServe?</h2>
        <div className="features-grid">
          <div className="feature-card glass reveal hover-lift">
            <div className="feature-icon-wrap">
              <Zap size={28} />
            </div>
            <h3>Lightning Fast</h3>
            <p>Our routing algorithm ensures your food arrives hot and fresh.</p>
          </div>
          <div className="feature-card glass reveal hover-lift" style={{ transitionDelay: '0.1s' }}>
            <div className="feature-icon-wrap">
              <UtensilsCrossed size={28} />
            </div>
            <h3>Best Restaurants</h3>
            <p>Curated selection of top-rated local dining spots.</p>
          </div>
          <div className="feature-card glass reveal hover-lift" style={{ transitionDelay: '0.2s' }}>
            <div className="feature-icon-wrap">
              <ShieldCheck size={28} />
            </div>
            <h3>Secure Ordering</h3>
            <p>End-to-end encrypted payments and live order tracking.</p>
          </div>
        </div>
      </section>

      <section className="cta-section container reveal">
        <div className="cta-card glass">
          <h2>Hungry already?</h2>
          <p>Browse hundreds of dishes from the best kitchens near you.</p>
          <Link to="/restaurants" className="btn btn-primary btn-lg shine">
            Explore Restaurants <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
