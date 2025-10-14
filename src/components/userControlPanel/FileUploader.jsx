import React, { useState } from "react";
import "../../styles/userControlPanel.scss";

function FileUploader({ onFileSelected }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onFileSelected(file);
    }
  };

  return (
    <div className="form-row">
      <div className="form-row-file">
        <p>Dodaj sliku:</p>
        <input id="upload" type="file" onChange={handleFileChange} />
        {selectedFile && <p>Izabrani fajl: {selectedFile.name}</p>}
        {preview && (
          <div className="preview">
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "150px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploader;
