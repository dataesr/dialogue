import { Route, Routes } from "react-router-dom"

import Builder from "./pages/admin/builder/index.tsx"
import Campaign from "./pages/admin/campaigns/[id]/index.tsx";
import Campaigns from "./pages/admin/campaigns/index.tsx"
import Layout from "./layout/index.tsx";
import Logs from "./pages/admin/logs/index.tsx";
import Users from "./pages/admin/users/index.tsx"
import Vintage from "./pages/admin/campaigns/[id]/vintages/[id]";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Campaigns />} />
        <Route path="/campagnes/:campaignId" element={<Campaign />} />
        <Route path="/campagnes/:campaignId/millesimes/:vintageId" element={<Vintage />} />
        <Route path="/formulaire" element={<Builder />} />
        <Route path="/utilisateurs" element={<Users />} />
        <Route path="/logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}
