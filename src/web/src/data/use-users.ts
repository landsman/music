import { useQuery } from "../lib/react-query";
import { getUsers, User } from "./users-api";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: ({ signal }) => getUsers(signal),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
