import { useQuery } from "../lib/react-query.tsx";
import { getUsers, User } from "./users-api.ts";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: ({ signal }) => getUsers(signal),
    staleTime: 10 * 60 * 1000,
  });
}
