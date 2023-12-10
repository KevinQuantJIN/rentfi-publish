import ApplyDetail from "./applyDetail";
import ApplyList from "./applyList";

const tenantManagement = () => {
  return (
    <div
      className="grid lg:grid-cols-2 flex-grow"
      style={{ backgroundImage: "url(https://cdn.midjourney.com/65c53a56-58c1-4e2b-bc8b-6faaca61f910/0_3.webp)" }}
    >
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <ApplyList />
        </div>
      </div>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <ApplyDetail />
        </div>
      </div>
    </div>
  );
};

export default tenantManagement;
