"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// React query needs context to work
const Providers = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
