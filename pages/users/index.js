import { useRouter } from "next/router";
import React from "react";
import AppConfig from "../../layout/AppConfig";
import { Button } from "primereact/button";

const UsersCrud = () => {
  const router = useRouter();

  return (
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      pagina de users
    </div>
  );
};

export default UsersCrud;
