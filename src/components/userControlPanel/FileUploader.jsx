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
      <div className="form-row-file">
        <p>Dodaj sliku:</p>
        <input id="upload" type="file" onChange={handleFileChange} />
        {selectedFile && (
          <p>Izabrani fajl: {selectedFile.name}</p>
        )}
      </div>
    </div>
  );
}

export default FileUploader;
