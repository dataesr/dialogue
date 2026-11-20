import { Route, Routes } from "react-router-dom"

import Layout from "./layout/index.tsx"
import Builder from "./pages/admin/builder/index.tsx"
import Campaign from "./pages/admin/campaigns/[id]/index.tsx"
import Campaigns from "./pages/admin/campaigns/index.tsx"
import Users from "./pages/admin/users/index.tsx"
import Vintage from "./pages/admin/vintages/[id]/index.tsx"

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Campaigns />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/campaigns/:id" element={<Campaign />} />
        <Route path="/users" element={<Users />} />
        <Route path="/vintages/:id" element={<Vintage />} />
      </Route>
    </Routes>
  )
}
