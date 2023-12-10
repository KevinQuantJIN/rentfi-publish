import React from "react";

// 显式地声明onRoleSelect的类型
type RoleSelectionProps = {
  onRoleSelect: (role: string) => void;
};

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }: RoleSelectionProps) => {
  const handleRoleSelect = (role: string) => {
    onRoleSelect(role);
  };

  return (
    <div>
      <form className="card-body">
        <h2 className="text-center lg:text-left text-2xl font-bold text-3xl">Who Are You?</h2>
        <div className="form-control">
          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={() => handleRoleSelect("tenant")}>
              Tenant
            </button>
          </div>
        </div>
        <div className="form-control mt-6">
          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={() => handleRoleSelect("landlord")}>
              Landlord
            </button>
          </div>
        </div>
        <div className="form-control mt-6">
          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={() => handleRoleSelect("investor")}>
              Investor
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RoleSelection;
