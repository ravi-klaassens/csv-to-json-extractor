import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { parse } from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Read file as text
    const text = await file.text();
    
    // Parse CSV
    const results = parse(text, {
      header: true,
      skipEmptyLines: true,
    });
    
    console.log(`Parsed ${results.data.length} rows from CSV`);
    
    // Create a zip file
    const zip = new JSZip();
    let processedCount = 0;
    
    // Try to find slug and JSON in the data
    for (const row of results.data as any[]) {
      if (!row) continue;
      
      // Look for slug - it might be in different capitalization or naming
      let slug = '';
      let jsonContent = '';
      
      // Find the slug column - check for common variations
      for (const key of Object.keys(row)) {
        if (
          key.toLowerCase() === 'slug' || 
          key.toLowerCase().includes('slug') ||
          key.toLowerCase() === 'name'
        ) {
          slug = String(row[key]).trim();
          break;
        }
      }
      
      // Find the JSON column - check for common variations
      for (const key of Object.keys(row)) {
        if (
          key.toLowerCase() === 'json' || 
          key.toLowerCase().includes('json') ||
          key.toLowerCase().includes('data')
        ) {
          const content = String(row[key]).trim();
          if (content.startsWith('{') && content.endsWith('}')) {
            jsonContent = content;
            break;
          } else if (content.startsWith('"{') && content.endsWith('}"')) {
            // Handle double-quoted JSON strings
            jsonContent = content.substring(1, content.length - 1).replace(/""/g, '"');
            break;
          }
        }
      }
      
      // If we have both slug and JSON, add to the zip
      if (slug && jsonContent) {
        try {
          // Just validate JSON is valid but DO NOT re-stringify it
          // This helps catch syntax errors but preserves exact content
          JSON.parse(jsonContent.replace(/""/g, '"'));
          
          // Store the original JSON content without modification
          zip.file(`${slug}.json`, jsonContent);
          processedCount++;
        } catch (error) {
          console.error(`Error validating JSON for ${slug}:`, error);
          
          // If validation fails, still try to save the raw content
          if (jsonContent.startsWith('{') && jsonContent.endsWith('}')) {
            zip.file(`${slug}.json`, jsonContent);
            processedCount++;
          }
        }
      }
    }
    
    console.log(`Successfully processed ${processedCount} JSON files`);
    
    if (processedCount === 0) {
      return NextResponse.json({ 
        error: 'No valid JSON data found in CSV' 
      }, { status: 400 });
    }
    
    // Generate zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipBuffer = await zipBlob.arrayBuffer();
    
    // Return the zip file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=json-files-${processedCount}.zip`,
      },
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json(
      { error: 'Error processing CSV file' }, 
      { status: 500 }
    );
  }
} 