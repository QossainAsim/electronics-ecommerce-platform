// *********************
// Role of the component: Image gallery with clickable thumbnails for product page
// Name of the component: ImageGallery.tsx
// Developer: Updated Version
// Version: 1.0
// Component call: <ImageGallery images={allImages} productTitle={title} hasActiveDeal={hasActiveDeal} />
// Input parameters: { images: ImageItem[], productTitle: string, hasActiveDeal: boolean }
// Output: Main product image with clickable thumbnail gallery
// *********************

"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageItem {
  imageID: string;
  image: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  productTitle: string;
  hasActiveDeal: boolean;
}

const ImageGallery = ({ images, productTitle, hasActiveDeal }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Ensure we have at least one image
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center">
        <p className="text-neutral-400">No image available</p>
      </div>
    );
  }

  const currentImage = images[selectedImageIndex];

  return (
    <div className="space-y-4">
      {/* Main Product Image */}
      <div className="relative aspect-square bg-white rounded-xl border border-neutral-100 overflow-hidden group">
        <Image
          src={currentImage?.image?.startsWith('/') 
            ? currentImage.image 
            : `/${currentImage?.image || 'product_placeholder.jpg'}`
          }
          fill
          alt={productTitle}
          className="object-contain p-6 lg:p-10 group-hover:scale-105 transition-transform duration-300"
          priority
        />
        
        {/* Sale Badge */}
        {hasActiveDeal && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
            Sale
          </div>
        )}
      </div>

      {/* Thumbnail Images - Only show if there are multiple images */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((imageItem: ImageItem, index: number) => (
            <button
              key={imageItem.imageID || index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 bg-white rounded-lg border-2 cursor-pointer transition-all overflow-hidden hover:border-neutral-400 ${
                selectedImageIndex === index ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2' : 'border-neutral-200'
              }`}
            >
              <Image
                src={imageItem.image.startsWith('/') ? imageItem.image : `/${imageItem.image}`}
                fill
                alt={`${productTitle} view ${index + 1}`}
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;