import { Route, Routes } from "react-router-dom"

import Layout from "./layout/index.tsx"
import Builder from "./pages/admin/builder/index.tsx"
import Campaign from "./pages/admin/campaigns/[id]/index.tsx"
import Campaigns from "./pages/admin/campaigns/index.tsx"
// import Logs from "./pages/admin/logs/index.tsx"
import Vintage from "./pages/admin/campaigns/[id]/vintages/[id]"
import Structures from "./pages/admin/structures/index.tsx"
import Users from "./pages/admin/users/index.tsx"

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Campaigns />} />
        <Route path="/campagnes/:campaignId" element={<Campaign />} />
        <Route path="/campagnes/:campaignId/millesimes/:vintageId" element={<Vintage />} />
        <Route path="/formulaire" element={<Builder />} />
        <Route path="/utilisateurs" element={<Users />} />
        {/* <Route path="/logs" element={<Logs />} /> */}
        <Route path="/etablissements" element={<Structures />} />
      </Route>
    </Routes>
  );
}
