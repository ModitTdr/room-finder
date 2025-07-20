// src/components/UploadWidget.js
import { useEffect, useRef } from "react";

const UploadWidget = ({ onUpload }) => {
   const cloudinaryRef = useRef();
   const widgetRef = useRef();

   useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      script.onload = () => {
         cloudinaryRef.current = window.cloudinary;
         widgetRef.current = cloudinaryRef.current.createUploadWidget(
            {
               cloudName: import.meta.env.VITE_API_CLOUDINARY_CLOUDNAME,
               uploadPreset: import.meta.env.VITE_API_CLOUDINARY_UPLOADPRESET,
            },
            (error, result) => {
               if (!error && result.event === "success") {
                  onUpload(result.info);
               }
            }
         );
      };

      document.body.appendChild(script);
   }, [onUpload]);

   const openWidget = () => {
      if (widgetRef.current) {
         widgetRef.current.open();
      }
   };

   return (
      <button onClick={openWidget} className="btn">
         Upload Image
      </button>
   );
};

export default UploadWidget;
