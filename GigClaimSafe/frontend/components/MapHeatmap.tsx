'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const cities = [
  { name: 'Mumbai', coords: [72.8777, 19.0760] },
  { name: 'Delhi', coords: [77.1025, 28.7041] },
  { name: 'Bangalore', coords: [77.5946, 12.9716] },
  { name: 'Chennai', coords: [80.2707, 13.0827] },
  { name: 'Hyderabad', coords: [78.4867, 17.3850] },
  { name: 'Kolkata', coords: [88.3639, 22.5726] },
  { name: 'Pune', coords: [73.8567, 18.5204] },
  { name: 'Ahmedabad', coords: [72.5714, 23.0225] },
];

export default function MapHeatmap({ risk }: { risk: Record<string, number> }) {
  const [topoData, setTopoData] = useState<any>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json')
      .then((res) => res.json())
      .then(setTopoData)
      .catch(() => setTopoData(null));
  }, []);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">India Disruption Heatmap</h3>
      <p className="mt-2 text-sm text-slate-500">City risk intensity from recent event frequency.</p>
      <div className="mt-6">
        {topoData ? (
          <ComposableMap projection="mercator" projectionConfig={{ scale: 900 }} width={520} height={360}>
            <Geographies geography={topoData}>
              {({ geographies }) => (
                <> 
                  {geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} fill="#E2E8F0" stroke="#CBD5E1" />
                  ))}
                  {cities.map((city) => (
                    <Marker key={city.name} coordinates={city.coords}>
                      <circle r={6} fill={risk[city.name] > 60 ? '#dc2626' : risk[city.name] > 40 ? '#f59e0b' : '#10b981'} stroke="#fff" strokeWidth={2} />
                    </Marker>
                  ))}
                </>
              )}
            </Geographies>
          </ComposableMap>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cities.map((city) => (
              <div key={city.name} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{city.name}</p>
                <p className="mt-2 text-sm text-slate-600">Risk {risk[city.name] ?? 0}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
