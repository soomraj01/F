import { useState } from 'react';
import { ImagePlus, Upload } from 'lucide-react';

// This component accepts a local image, previews it, and reports the data URL to the form.
function UploadBox({ label, image, onChange, large }) {
  const [value, setValue] = useState(image || '');
  const [error, setError] = useState('');

  // This function reads the original local image without resizing or recompressing it.
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = String(reader.result);
      setValue(imageData);
      setError('');
      onChange(imageData);
    };
    reader.readAsDataURL(file);
  };

  // This function keeps URL-based images available for existing projects and quick testing.
  const saveUrl = () => {
    onChange(value);
    setError('');
  };

  return (
    <div className={large ? 'upload-box large' : 'upload-box'}>
      <strong>{label}</strong>
      {value ? <img src={value} alt="Uploaded preview" /> : <div className="upload-placeholder"><ImagePlus size={21} /><span>Choose from your computer</span><small>PNG, JPG or WebP, max 5 MB</small></div>}
      <label className="file-picker"><ImagePlus size={14} /> Choose image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} /></label>
      <div className="upload-input"><input value={value.startsWith('data:') ? '' : value} onChange={(event) => setValue(event.target.value)} onBlur={saveUrl} placeholder="Or paste an image URL" /><button type="button" onClick={saveUrl}><Upload size={14} /></button></div>
      {error && <small className="upload-error">{error}</small>}
    </div>
  );
}

export default UploadBox;
