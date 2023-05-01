import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const MapNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
});

export default function Home() {
  const [zipcode, setZipcode] = useState('');
  const [data, setData] = useState(null);

  const fetchZipcodeData = async () => {
    const options = {
      method: 'GET',
      url: 'https://vanitysoft-boundaries-io-v1.p.rapidapi.com/rest/v1/public/boundary/zipcode',
      params: { zipcode },
      headers: {
        'X-RapidAPI-Key': 'f5ddd8b91emsh0b7e1efced72dbbp1530edjsn05202bcc5acc',
        'X-RapidAPI-Host': 'vanitysoft-boundaries-io-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      setData(response.data.features[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchZipcodeData();
  };

  return (
    <div>
      <h1>Zipcode Visualizer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Zipcode"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {data && <MapNoSSR data={data} />}
    </div>
  );
}
