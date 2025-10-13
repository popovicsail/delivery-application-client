import React, { useState } from 'react';
import "../../styles/userControlPanel.scss";

function FileUploader({ onFileProcessed }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      //  Dozvoljeni tipovi
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        alert('Samo PNG i JPEG su dozvoljeni!');
        return;
      }

      setSelectedFile(file);

      // Konverzija u Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // skini "data:image/png;base64,"
        onFileProcessed({
          base64: base64String,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-row">
      <div className="form-row-file">
        <p>Dodaj sliku:</p>
        <input
          id="upload"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
        {selectedFile && <p>Izabrani fajl: {selectedFile.name}</p>}
      </div>
    </div>
  );
}

export default FileUploader;