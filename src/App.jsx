import { useState } from 'react';
import Papa from 'papaparse';
import './App.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Assuming you'll add this via shadcn
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CsvViewer } from '@/components/ui/csv-viewer'; // We will create this

function App() {
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setError('Invalid file type. Please upload a CSV file.');
        setCsvData([]);
        setCsvHeaders([]);
        setFileName('');
        return;
      }
      setError('');
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError('Error parsing CSV: ' + results.errors.map(err => err.message).join(', '));
            setCsvData([]);
            setCsvHeaders([]);
            return;
          }
          if (results.data.length > 0 && results.meta.fields) {
            setCsvHeaders(results.meta.fields);
            setCsvData(results.data);
          } else {
            setError('CSV file is empty or headers could not be parsed.');
            setCsvData([]);
            setCsvHeaders([]);
          }
        },
        error: (err) => {
          setError('Failed to parse CSV file: ' + err.message);
          setCsvData([]);
          setCsvHeaders([]);
        }
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Input type="file" accept=".csv" onChange={handleFileChange} className="max-w-sm" />
            {fileName && <p className="text-sm text-muted-foreground">Selected file: {fileName}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {csvData.length > 0 && csvHeaders.length > 0 && (
        <CsvViewer headers={csvHeaders} data={csvData} />
      )}
    </div>
  );
}

export default App;
