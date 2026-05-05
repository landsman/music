import { useLingui } from "@lingui/react/macro";
import { useUsers } from "../../../data/use-users.ts";

interface UserFilterProps {
  value: string;
  onChange: (userId: string) => void;
}

export function UserFilter({ value, onChange }: UserFilterProps) {
  const { t } = useLingui();
  const { data: users = [] } = useUsers();

  return (
    <div className="user-filter">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{t`allUsers`}</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.lastfm_user}
          </option>
        ))}
      </select>
    </div>
  );
}
