import styles from './styles.module.scss';
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { cropImage } from 'src/helpers/cropImages';

export function CropImage({ imagePath, close, setImage }) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onClick = async () => {
        const response: any = await cropImage(imagePath, croppedAreaPixels);
        setImage(response.file);
        close();
    }
    const onCropComplete = useCallback(
        (croppedArea: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <div className={styles.cropper}>
                    <Cropper
                        image={imagePath}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 4}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className="d-flex justify-content-center gap-3">
                    <button onClick={onClick}>
                        Cancelar
                    </button>
                    <button onClick={onClick}>
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}