import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

export function ReactQuery({ children }: { children: React.JSX.Element }) {
  return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
  )
}