import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styles from "../styles/index.module.css";


const MapNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
});

export default function Home() {
  const [zipcode, setZipcode] = useState('');
  const [data, setData] = useState(null);
  var api_key = process.env.NEXT_PUBLIC_API_KEY;

  const fetchZipcodeData = async () => {
    const options = {
      method: 'GET',
      url: 'https://vanitysoft-boundaries-io-v1.p.rapidapi.com/rest/v1/public/boundary/zipcode',
      params: { zipcode },
      headers: {
        'X-RapidAPI-Key': api_key,
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
    <div className={styles.container}>
      <h1 className={styles.h1} >Zipcode <span style={{ fontFamily: 'Segoe UI Symbol, sans-serif', fontSize: '27px', color: "rgb(0, 119, 255)"}}>Polygon</span> Visualizer</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input className={styles.input}
          type="text"
          placeholder="Enter Zipcode"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <button className={styles.button} type="submit">Search</button>
      </form>
      <p className={styles.p} >Click on the <span style={{color: "rgb(0, 119, 255)"}}>Zip Area</span> for Details</p>
      {data && <MapNoSSR data={data} />}
    </div>
  );
}
