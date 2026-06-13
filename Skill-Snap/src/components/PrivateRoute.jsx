import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");
  console.log("Roadmap mounted");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
