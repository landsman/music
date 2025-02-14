export function Track({ name }: { name: string }) {
    if (name.length <= 25) {
        return name;
    }

    return (
        <div className="marquee-container">
            <div className="marquee">{name}</div>
        </div>
    )
}