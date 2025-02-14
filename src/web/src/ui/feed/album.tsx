import {Disc} from "lucide-react";

interface AlbumProps {
    name: string | null;
}

export function Album({ name }: AlbumProps) {
    if (!name) {
        return null;
    }
    return (
        <div className='artist__album' title={name}>
            <Disc size={11} />
            <span>{name}</span>
        </div>
    )
}