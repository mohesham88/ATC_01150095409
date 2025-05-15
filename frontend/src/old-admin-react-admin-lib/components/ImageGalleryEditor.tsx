import { useEffect, useState } from "react";
import { Button, useRecordContext } from "react-admin";

export const ImageGalleryEditor = () => {
  const record = useRecordContext();
  const [images, setImages] = useState(record?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleRemoveImage = (srcToRemove: string) => {
    setImages((prev: any) =>
      prev.filter((img: any) => img.src !== srcToRemove)
    );
  };

  const handleNewImageChange = (e: any) => {
    setNewImages(e.target.files ? Array.from(e.target.files) : []);
  };

  return (
    <div>
      <label>Existing Images:</label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {images.map((img: any) => (
          <div key={img.buffer} style={{ position: "relative" }}>
            <img src={img.buffer} alt={img.title} width={100} />
            <button
              type="button"
              onClick={() => handleRemoveImage(img.src)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <label>Add New Images:</label>
      <input type="file" multiple onChange={handleNewImageChange} />
      {/* You can preview new images here if you want */}
      <input type="hidden" name="images" value={JSON.stringify([...images])} />
      <input type="hidden" name="newImages" value={JSON.stringify(newImages)} />
    </div>
  );
};

export const ExistingImagesInput = ({ source }) => {
  const record = useRecordContext();
  const [images, setImages] = useState<any[]>([]);

  // useEffect(() => {
  //   if (record?.[0]?.images) {
  //     console.log(record);
  //     setImages(record[0].images);
  //   }
  // }, []);

  const handleRemove = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  // Expose this to the form's submit
  if (record) {
    record[source] = images;
  }

  return (
    <div>
      <label>Existing Images</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {images.map((img) => (
          <div key={img} style={{ position: "relative" }}>
            <img
              src={`data:image/jpeg;base64,${img.buffer}`}
              alt=""
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
            <Button
              onClick={() => handleRemove(img)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                minWidth: "unset",
                padding: "2px 6px",
              }}
            >
              X
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
