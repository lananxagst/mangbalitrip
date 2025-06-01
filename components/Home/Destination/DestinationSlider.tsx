"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Destination type definition
interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  price: number;
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1324 },
    items: 5,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1324, min: 764 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 764, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const DestinationSlider = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        // Gunakan URL dengan port yang benar (3001) di development
        const apiUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3000/api/destinations'
          : '/api/destinations';
        console.log('Fetching destinations from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${await response.text()}`);
        }
        
        const data = await response.json();
        console.log('Destinations data received:', data);
        setDestinations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Hanya jalankan di sisi client untuk menghindari hydration mismatch
    fetchDestinations();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading destinations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (destinations.length === 0) {
    return <div className="text-center py-10">No destinations found.</div>;
  }

  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={5000}
      keyBoardControl={true}
    >
      {destinations.map((destination) => (
        <div key={destination.id} className="m-3">
          {/* Image Div */}
          <div className="relative h-[400px]">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-25 rounded-lg"></div>
            {/* Image */}
            <Image
              src={destination.image}
              alt={destination.name}
              width={500}
              height={500}
              className="h-full w-full object-cover rounded-lg"
              onError={(e) => {
                console.error('Image failed to load:', destination.image);
                // Gunakan placeholder image jika gambar tidak dapat dimuat
                (e.target as HTMLImageElement).src = 'https://placehold.co/500x500/png?text=Image+Not+Found';
              }}
            />
            {/* Text Content */}
          </div>
          <h1 className="text-lg font-semibold mt-4">{destination.name}</h1>
          <p className="text-sm text-gray-600 line-clamp-2">{destination.description}</p>
          <p className="text-sm font-bold mt-2">${destination.price}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default DestinationSlider;
