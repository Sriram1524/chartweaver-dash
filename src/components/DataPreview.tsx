import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataPreviewProps {
  data: any[];
  fileName: string;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data, fileName }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);
  const previewData = data.slice(0, 10); // Show only first 10 rows

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Data Preview</span>
          <span className="text-sm font-normal text-muted-foreground">
            {fileName} ({data.length} rows)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="font-semibold">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="py-2">
                      {String(row[column] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {data.length > 10 && (
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Showing first 10 rows of {data.length} total rows
          </p>
        )}
      </CardContent>
    </Card>
  );
};