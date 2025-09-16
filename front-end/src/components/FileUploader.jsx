import { useState } from "react";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* BOUTON D'UPLOAD */}
      {!selectedFile && (
        <>
          <label
            htmlFor="file-upload"
            className="cursor-pointer w-10 h-10 flex justify-center items-center rounded-full border border-white bg-[var(--color-3)]"
          >
            <i className="bx bxs-file-blank text-[var(--color-1)] text-xl"></i>
          </label>

          <input
            id="file-upload"
            type="file"
            onChange={handleFile}
            style={{ display: "none" }}
            accept=".txt,.pdf,.docx,.ppt,.pptx"
          />
        </>
      )}

      {/* AFFICHAGE DU FICHIER SÉLECTIONNÉ */}
      {selectedFile && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-3)] rounded-xl border border-white">
          <i className="bx bxs-file-blank text-[var(--color-1)] text-xl" />
          <span className="text-[var(--color-1)] text-sm max-w-[150px] truncate">
            {selectedFile.name}
          </span>
          <button
            onClick={removeFile}
            className="ml-1 text-[var(--color-1)] hover:text-red-500 font-bold"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;