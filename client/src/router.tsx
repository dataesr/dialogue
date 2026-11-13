import { Route, Routes } from "react-router-dom";

import Layout from "./layout/index.tsx";
import AdminCampaigns from "./pages/admin/campaigns/index.tsx";
// import Home from "./pages/home/index.tsx";
import AdminUsers from "./pages/admin/users/index.tsx";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* <Route path="/" element={<AdminCampaigns />} /> */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
