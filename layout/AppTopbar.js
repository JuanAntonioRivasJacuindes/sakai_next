import Link from "next/link";
import Router, { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { AuthService } from "../service/AuthService";

import { LayoutContext } from "./context/layoutcontext";

const auth = new AuthService();
const AppTopbar = forwardRef((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));
  const logout = () => {
    if (localStorage.getItem("AuthToken")) {
      auth.getLogout(localStorage.getItem("AuthToken")).then((res) => {
        console.log(res);
      });
    }
    localStorage.removeItem("AuthToken");
    window.location.reload();
  };
  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img
          src={`/layout/images/logo-${
            layoutConfig.colorScheme !== "light" ? "white" : "dark"
          }.svg`}
          width="47.22px"
          height={"35px"}
          widt={"true"}
          alt="logo"
        />
        <span>SAKAI</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-calendar"></i>
          <span>Calendar</span>
        </button>
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>
        <Link href="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link>
        <button className="p-link layout-topbar-button" onClick={logout}>
          <i className="pi pi-sign-out" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
});

export default AppTopbar;
