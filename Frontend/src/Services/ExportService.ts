export const exportToCSV = (data: any[], filename: string) => {
  let csvData = 'Destination, Followers\n';
  csvData += data.map(item => `"${item.destination}",${item.followers}`).join('\n');

  const blob = new Blob([csvData], { type: 'text/csv' });

  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);

  link.click();
  
  document.body.removeChild(link);
};
