# CSV to JSON Extractor

<div align="center">
  <p><strong>Convert CSV files with JSON data into individual JSON files</strong></p>
</div>

## 📝 Overview

CSV to JSON Extractor is a web application that helps you extract JSON data from CSV files and save them as individual JSON files. It's designed to handle CSV files that contain:

- A column with slugs (filenames)
- A column with JSON data

The app will automatically extract the JSON, validate it, and create a zip file containing individual JSON files named according to their slugs.

## ✨ Features

- **Smart Column Detection**: Finds slug and JSON columns even if they're not exactly labeled "slug" or "json"
- **JSON Validation**: Ensures the extracted JSON is valid
- **Automatic Formatting**: Pretty-prints the JSON in the output files
- **Error Handling**: Detailed feedback when issues occur during processing
- **Responsive UI**: Works on desktop and mobile devices
- **Dark Mode Support**: Adapts to your system preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (included with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/csv-to-json-extractor.git
cd csv-to-json-extractor
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:3000

## 🧩 CSV Format Requirements

The application is designed to be flexible with CSV formats, but your CSV file should have:

1. A column containing slugs (used for filenames)
2. A column containing JSON data

Example CSV format:

```
Componentnaam,Slug,JSON
Belofte Bouwblok 1,belofte-bouwblok-1,{"type":"@webflow/XscpData","payload":{...}}
Belofte Bouwblok 2,belofte-bouwblok-2,{"type":"@webflow/XscpData","payload":{...}}
```

#### Notes:

- The application can detect columns with variations of "slug" and "json" (case-insensitive)
- JSON data can be enclosed in double quotes with escaped inner quotes (`"{"key":"value"}"`)
- If the slug is missing, the JSON won't be processed

## 📦 Output

The application will generate a zip file containing:
- Individual JSON files, each named according to its corresponding slug
- Files are formatted for readability (pretty-printed)

Example output file: `belofte-bouwblok-1.json`

## 🔧 Building for Production

To build the app for production:

```bash
npm run build
```

To start the production build:

```bash
npm start
```

## 💻 Technology Stack

- **Next.js**: React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **JSZip**: JavaScript library for creating ZIP files
- **Papa Parse**: CSV parser

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [PapaParse](https://www.papaparse.com/) - CSV Parser for JavaScript
- [JSZip](https://stuk.github.io/jszip/) - Create, read and edit .zip files with JavaScript
