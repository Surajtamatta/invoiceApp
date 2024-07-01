import React, { useRef, useEffect, useState } from 'react';

const DownloadButton = ({ targetRef }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = () => {
    if (isClient && targetRef.current) {
      import('html2pdf.js').then(html2pdf => {
        const element = targetRef.current;
        html2pdf.default().from(element).set({
          margin: 0.5,
          filename: 'invoice.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 4 },
          jsPDF: { unit: 'in', format: [9.5,12], orientation: 'portrait' }
        }).save();
      });
    }
  };

  return (
    <button className="btn" onClick={handleDownload}>Download</button>
  );
};

export default DownloadButton;
