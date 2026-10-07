import './RestaurantCardSkeleton.css';

const RestaurantCardSkeleton = () => (
  <div className="restaurant-card-skeleton glass">
    <div className="skeleton skel-image" />
    <div className="skel-body">
      <div className="skeleton skel-line skel-title" />
      <div className="skeleton skel-line skel-sub" />
      <div className="skel-meta">
        <div className="skeleton skel-line skel-pill" />
        <div className="skeleton skel-line skel-pill" />
      </div>
    </div>
  </div>
);

export default RestaurantCardSkeleton;
