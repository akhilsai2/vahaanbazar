"use client";
import React from "react";
import Link from "next/link";
import { PanelMenu } from "primereact/panelmenu";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../login/login.css";

const SideMenu = () => {
  const items = [
    {
      label: "Activity",
      // icon: "pi pi-user",
      expanded: true,
      items: [
        {
          label: "Users",
          // icon: "pi pi-user",
          template: () => (
            <div className="p-menuitem-link" onClick={(e) => e.stopPropagation()}>
              <Link href="/vahaanbazar/users">
                {/* <span className="pi pi-user mr-2" /> */}
                <span>Users</span>
              </Link>
            </div>
          ),
        },
        {
          label: "User Plans",
          // icon: "pi pi-list",
          template: () => (
            <div className="p-menuitem-link" onClick={(e) => e.stopPropagation()}>
              <Link href="/vahaanbazar/user-plans">
                {/* <span className="pi pi-list mr-2" /> */}
                <span>User Plans</span>
              </Link>
            </div>
          ),
        },
      ],
    },
    {
      label: "Vehicle",
      // icon: "pi pi-id-card",
      expanded: true,
      items: [
        {
          label: "Access",
          icon: "pi pi-car",
          template: () => (
            <div className="p-menuitem-link" onClick={(e) => e.stopPropagation()}>
              <Link href="/vahaanbazar/vehicle-access">
                {/* <span className="pi pi-car mr-2" /> */}
                <span>Access</span>
              </Link>
            </div>
          ),
        },
        {
          label: "vehicle Vefication",
          // icon: "pi pi-check",
          template: () => (
            <div className="p-menuitem-link" onClick={(e) => e.stopPropagation()}>
              <Link href="/vahaanbazar/vehicle-verification">
                {/* <span className="pi pi-list mr-2" /> */}
                <span>Verification</span>
              </Link>
            </div>
          ),
        },
        {
          label: "vehicle Upload",
          // icon: "pi pi-check",
          template: () => (
            <div className="p-menuitem-link" onClick={(e) => e.stopPropagation()}>
              <Link href="/vahaanbazar/vehicle-upload">
                {/* <span className="pi pi-list mr-2" /> */}
                <span>Upload</span>
              </Link>
            </div>
          ),
        },
      ],
    },
    {
      label: "Bids",
      // icon: "pi pi-id-card",
      expanded: true,
      items: [
        {
          label: "View Bids",
          // icon: "pi pi-eye",
          template: () => (
            <div className="p-menuitem-link" onClick={(e) => e.stopPropagation()}>
              <Link href="/vahaanbazar/view-bids">
                {/* <span className="pi pi-eye mr-2" /> */}
                <span>View Bids</span>
              </Link>
            </div>
          ),
        },
        {
          label: "Bid Limit",
          // icon: "pi pi-sliders-h",
          template: () => (
            <div className="p-menuitem-link" onClick={(e) => e.stopPropagation()}>
              <Link href="/vahaanbazar/bid-limit">
                {/* <span className="pi pi-sliders-h mr-2" /> */}
                <span>Bid Limit</span>
              </Link>
            </div>
          ),
        },
      ],
    },
    {
      label: "Payment",
      // icon: "pi pi-id-card",
      expanded: true,
      items: [
        {
          label: "History",
          // icon: "pi pi-eye",
          template: () => (
            <div className="p-menuitem-link" onClick={(e) => e.stopPropagation()}>
              <Link href="/vahaanbazar/payment/history">
                {/* <span className="pi pi-eye mr-2" /> */}
                <span>History</span>
              </Link>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="fixed  left-0  text-white w-45 p-2 z-50 overflow-y-auto ">
      <PanelMenu model={items} className="w-[95%] text-white customPanelMenu" multiple />
    </div>
  );
};

export default SideMenu;
