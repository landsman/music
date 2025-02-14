import {UserRound} from "lucide-react";
import {i18n} from "../../i18n/i18n.ts";

interface UserProps {
    name: string | undefined;
}

export function User({ name }: UserProps) {
    return (
        <div className="user">
            <a href={`https://www.last.fm/user/${name || "unknown"}`} title={i18n.visitUserProfile}>
                <UserRound size={12} />
                <span>{name || "Unknown"}</span>
            </a>
        </div>
    )
}