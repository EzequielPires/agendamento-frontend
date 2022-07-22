import styles from '../styles/pages/crop.module.scss';
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

export default function Crop() {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
            image.src = url;
        });

    function getRadianAngle(degreeValue) {
        return (degreeValue * Math.PI) / 180;
    }

    function rotateSize(width, height, rotation) {
        const rotRad = getRadianAngle(rotation);

        return {
            width:
                Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
            height:
                Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
        };
    }

    const cropImage = async () => {
        const image: any = await createImage("https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000");
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return null;
        }

        // calculate bounding box of the rotated image
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            45
        );

        // set canvas size to match the bounding box
        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        ctx.drawImage(image, 0, 0);
        const data = ctx.getImageData(
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.putImageData(data, 0, 0);

        return new Promise((resolve, reject) => {
            canvas.toBlob((file: any) => {
                file.name = 'cropped.jpeg';
                resolve({ file: file, url: URL.createObjectURL(file) });
            }, 'image/jpeg');
        });
    }

    const onClick = async () => {
        const response = await cropImage();
        console.log(response);
    }
    const onCropComplete = useCallback(
        (croppedArea: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    return (
        <div className={styles.container}>
            <div className={styles.cropper}>
                <Cropper
                    image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 4}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <button onClick={onClick}>
                Cortar
            </button>
        </div>
    );
}