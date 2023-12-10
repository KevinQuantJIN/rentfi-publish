import ApplyDetail4ll from "./applyDetail4ll";
import ApplyList4ll from "./applyList4ll";

const landlordManagement = () => {
    return (
      <div
      className="grid lg:grid-cols-2 flex-grow"
      style={{ backgroundImage: "url(https://cdn.midjourney.com/3c9a4e35-8d2e-488d-8f27-d95e02dd1203/0_0.webp)" }}
    >
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <ApplyList4ll />
        </div>
      </div>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <ApplyDetail4ll />
        </div>
      </div>
    </div>
    );
  };
  
  export default landlordManagement;
  
  