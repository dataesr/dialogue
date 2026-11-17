import { Route, Routes } from "react-router-dom"

import Layout from "./layout/index.tsx"
import CampaignsId from "./pages/admin/campaigns/[id]/index.tsx"
import Campaigns from "./pages/admin/campaigns/index.tsx"
import Users from "./pages/admin/users/index.tsx"
import Vintages from "./pages/admin/vintages/index.tsx"

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignsId />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/vintages" element={<Vintages />} />
      </Route>
    </Routes>
  );
}
