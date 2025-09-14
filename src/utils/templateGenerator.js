export const generateExcelTemplate = () => {
  // Sample data with real Indian locations
  const templateData = [
    {
      'Location/Site Name': 'Delhi Industrial Zone',
      'Latitude': 28.6139,
      'Longitude': 77.2090,
      'Pb (mg/L)': 0.012,
      'As (mg/L)': 0.015,
      'Cd (mg/L)': 0.004,
      'Cr (mg/L)': 0.065,
      'Hg (mg/L)': 0.0012,
      'Fe (mg/L)': 0.35,
      'Mn (mg/L)': 0.12,
      'Zn (mg/L)': 3.2,
      'Cu (mg/L)': 2.1,
      'Ni (mg/L)': 0.025,
      'Sampling Date': '2024-01-15'
    },
    {
      'Location/Site Name': 'Mumbai Coastal Area',
      'Latitude': 19.0760,
      'Longitude': 72.8777,
      'Pb (mg/L)': 0.008,
      'As (mg/L)': 0.006,
      'Cd (mg/L)': 0.002,
      'Cr (mg/L)': 0.032,
      'Hg (mg/L)': 0.0008,
      'Fe (mg/L)': 0.18,
      'Mn (mg/L)': 0.06,
      'Zn (mg/L)': 1.8,
      'Cu (mg/L)': 1.2,
      'Ni (mg/L)': 0.015,
      'Sampling Date': '2024-01-16'
    },
    {
      'Location/Site Name': 'Chennai Mining District',
      'Latitude': 13.0827,
      'Longitude': 80.2707,
      'Pb (mg/L)': 0.025,
      'As (mg/L)': 0.032,
      'Cd (mg/L)': 0.008,
      'Cr (mg/L)': 0.095,
      'Hg (mg/L)': 0.0025,
      'Fe (mg/L)': 0.68,
      'Mn (mg/L)': 0.22,
      'Zn (mg/L)': 4.5,
      'Cu (mg/L)': 3.2,
      'Ni (mg/L)': 0.045,
      'Sampling Date': '2024-01-17'
    },
    {
      'Location/Site Name': 'Kolkata Industrial Belt',
      'Latitude': 22.5726,
      'Longitude': 88.3639,
      'Pb (mg/L)': 0.018,
      'As (mg/L)': 0.028,
      'Cd (mg/L)': 0.006,
      'Cr (mg/L)': 0.078,
      'Hg (mg/L)': 0.0018,
      'Fe (mg/L)': 0.45,
      'Mn (mg/L)': 0.15,
      'Zn (mg/L)': 2.8,
      'Cu (mg/L)': 2.5,
      'Ni (mg/L)': 0.032,
      'Sampling Date': '2024-01-18'
    },
    {
      'Location/Site Name': 'Bangalore Tech Hub',
      'Latitude': 12.9716,
      'Longitude': 77.5946,
      'Pb (mg/L)': 0.005,
      'As (mg/L)': 0.004,
      'Cd (mg/L)': 0.001,
      'Cr (mg/L)': 0.025,
      'Hg (mg/L)': 0.0005,
      'Fe (mg/L)': 0.12,
      'Mn (mg/L)': 0.04,
      'Zn (mg/L)': 1.2,
      'Cu (mg/L)': 0.8,
      'Ni (mg/L)': 0.012,
      'Sampling Date': '2024-01-19'
    }
  ];

  // Convert to CSV format
  const headers = Object.keys(templateData[0]);
  const csvContent = [
    headers.join(','),
    ...templateData.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle string values that might contain commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
};

export const downloadTemplate = () => {
  const csvContent = generateExcelTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'groundwater_analysis_template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};