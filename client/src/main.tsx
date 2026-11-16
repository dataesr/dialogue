import { DSFRConfig } from "@dataesr/dsfr-plus";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Link } from "react-router-dom"

import Router from "./router.tsx"

// Create a client
const queryClient = new QueryClient()

type RouterLinkProps = {
  children?: ReactNode;
  href: string;
  replace?: boolean;
  target?: "_blank" | "_parent" | "_self" | "_top";
};

// eslint-disable-next-line react-refresh/only-export-components
const RouterLink = ({ href, replace, target, ...props }: RouterLinkProps) => {
  if (target === "_blank") return <a href={href} target={target} {...props} />;
  return <Link to={href} replace={replace} {...props} />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DSFRConfig
        routerComponent={RouterLink}
        extendOptionalFieldsLabelsWith={null}
      >
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </DSFRConfig>
    </BrowserRouter>
  </StrictMode>
)
