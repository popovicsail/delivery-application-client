import React, { useState } from 'react';

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="form-row">
      <label htmlFor="upload">Dodaj sliku:</label>
      <input id="upload" type="file" onChange={handleFileChange} />

      {selectedFile && (
        <p>Izabrani fajl: {selectedFile.name}</p>
      )}
    </div>
  );
}

export default FileUploader;
