import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./getCroppedImg";
import styles from "./ImageCropModal.module.css";

/**
 * Modal that lets the user crop an image to fit the profile icon (circular).
 * Calls onComplete(croppedBlob) when done, or onCancel when cancelled.
 */
export default function ImageCropModal({ imageSrc, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPx) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  const handleUsePhoto = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete(blob);
    } catch (err) {
      console.error("Crop failed:", err);
      onCancel();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Crop profile photo">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Crop profile photo</h3>
          <p>Adjust the area to fit your profile icon</p>
        </div>
        <div className={styles.cropContainer}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className={styles.zoomRow}>
          <label htmlFor="zoom">Zoom</label>
          <input
            id="zoom"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className={styles.zoomSlider}
          />
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={saving}>
            Cancel
          </button>
          <button type="button" onClick={handleUsePhoto} className={styles.useBtn} disabled={saving}>
            {saving ? "Saving…" : "Use photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
