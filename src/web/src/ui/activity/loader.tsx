import {OrbitProgress} from "npm:react-loading-indicators@1.0.0";

type LoaderProps = {
    center?: boolean;
}

export function Loader({ center = false }: LoaderProps) {
    return (
        <div className={center ? 'loader__center' : undefined}>
            <OrbitProgress variant="track-disc" color={'#FFF'} />
        </div>
    );
}