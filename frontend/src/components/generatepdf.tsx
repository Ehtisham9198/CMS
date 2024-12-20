import { SERVER_URL } from '@/hooks/requests';
import React, { useState } from 'react';
import { useLocation, useParams } from "react-router-dom";

const FileDetails = ({fileId}: {fileId: string}) => {

  const [loading, setLoading] = useState(false);
  console.log(fileId)


  const handleDownloadPDF = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/files/${fileId}/generate-pdf`, {
        method: 'GET',
        headers: {
          Accept: 'application/pdf',
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'file_details.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }

    setLoading(false);
  };

  return (
      <button onClick={handleDownloadPDF} disabled={loading}>
        {loading ? 'Generating PDF...' : 'View as pdf'}
      </button>
  );
};

export default FileDetails;
