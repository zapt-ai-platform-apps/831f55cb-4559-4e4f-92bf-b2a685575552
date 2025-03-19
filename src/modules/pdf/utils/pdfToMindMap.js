import * as pdfjs from 'pdfjs-dist';
import * as Sentry from '@sentry/browser';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/**
 * Converts a PDF file to a structured data format for mind mapping
 * @param {File} file - The PDF file to convert
 * @returns {Promise<Object>} Structured data for creating a mind map
 */
export const convertPDFToMindMap = async (file) => {
  try {
    console.log('Starting PDF to mind map conversion...');
    
    // Get array buffer from file
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    console.log(`PDF loaded, ${pdf.numPages} pages found`);
    
    // Initialize structure and extract text from all pages
    const allText = await extractTextFromAllPages(pdf);
    
    // Parse document structure
    const structuredData = parseDocumentStructure(allText, file.name);
    
    console.log('PDF conversion completed, structured data:', structuredData);
    return structuredData;
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting PDF to mind map:', error);
    throw error;
  }
};

/**
 * Reads a file as an ArrayBuffer
 * @param {File} file - The file to read
 * @returns {Promise<ArrayBuffer>} The file content as ArrayBuffer
 */
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => {
      Sentry.captureException(error);
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extracts text from all pages of a PDF
 * @param {PDFDocumentProxy} pdf - The PDF document
 * @returns {Promise<string>} Extracted text from all pages
 */
const extractTextFromAllPages = async (pdf) => {
  const numPages = pdf.numPages;
  let fullText = '';
  
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Combine text items, preserving the structure
    const pageText = textContent.items
      .map(item => {
        // Check if it's a text item
        if ('str' in item) {
          return item.str;
        }
        return '';
      })
      .join(' ');
    
    fullText += pageText + '\n\n';
  }
  
  return fullText;
};

/**
 * Parses the document structure from extracted text
 * @param {string} text - The extracted PDF text
 * @param {string} fileName - The name of the PDF file
 * @returns {Object} Structured data for the mind map
 */
const parseDocumentStructure = (text, fileName) => {
  // Start with the file name as the title
  const fileTitle = fileName.replace(/\.pdf$/i, '');
  
  // Split into lines and filter out empty ones
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  
  // Try to identify a title from the first few lines
  let title = fileTitle;
  if (lines.length > 0) {
    // Use the first non-empty line as title if it's relatively short
    const potentialTitle = lines[0].trim();
    if (potentialTitle.length < 100) {
      title = potentialTitle;
    }
  }
  
  // Create base structure
  const structure = {
    title,
    children: []
  };
  
  // Look for patterns that might indicate headers/sections
  const patterns = [
    // Match numbered headers like "1. Introduction", "1.1 Background", etc.
    { regex: /^\s*(\d+(\.\d+)*)\s+(.+)$/i, level: matches => matches[1].split('.').length },
    
    // Match capitalized headers
    { regex: /^([A-Z][A-Z\s]{5,})$/, level: () => 1 },
    
    // Match headers with common prefixes
    { regex: /^\s*(chapter|section|part)\s+(\d+)[\s:.]+(.+)$/i, level: () => 1 }
  ];
  
  let currentLevel = 0;
  let currentPath = [structure]; // Stack to track the current path in the hierarchy
  
  // Process each line to find potential sections
  lines.forEach(line => {
    // Skip very short lines that are likely not headers
    if (line.trim().length < 3) return;
    
    // Check if the line matches any of our header patterns
    for (const pattern of patterns) {
      const matches = line.match(pattern.regex);
      if (matches) {
        const level = pattern.level(matches);
        const headerText = matches[matches.length - 1].trim();
        
        // Skip if it looks like a page number or footnote
        if (/^\d+$/.test(headerText) || headerText.length < 3) continue;
        
        // Handle level change
        if (level > currentLevel) {
          // Going deeper
          currentLevel = level;
        } else if (level < currentLevel) {
          // Going back up
          const levelsUp = currentLevel - level;
          for (let i = 0; i < levelsUp; i++) {
            currentPath.pop();
          }
          currentLevel = level;
        }
        
        // Create the new node
        const newNode = {
          title: headerText,
          children: []
        };
        
        // Add to the current parent
        const currentParent = currentPath[currentPath.length - 1];
        currentParent.children.push(newNode);
        
        // Update current path
        currentPath.push(newNode);
        
        break; // Stop checking patterns once we've found a match
      }
    }
  });
  
  // If we couldn't extract a proper structure, create a simple one
  if (structure.children.length === 0) {
    structure.children = createSimpleStructure(lines, title);
  }
  
  return structure;
};

/**
 * Creates a simple structure when a more sophisticated one cannot be determined
 * @param {string[]} lines - Text lines from the PDF
 * @param {string} title - The overall title
 * @returns {Array} Simple structure of key phrases
 */
const createSimpleStructure = (lines, title) => {
  // Extract key phrases or sentences
  const keyPhrases = [];
  const processedPhrases = new Set(); // To avoid duplicates
  
  // Look for sentences that might be important
  lines.forEach(line => {
    // Skip very short lines
    if (line.trim().length < 15) return;
    
    // Split into sentences
    const sentences = line.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      // Skip short sentences and duplicates
      if (trimmed.length < 15 || processedPhrases.has(trimmed)) return;
      
      // Add to our phrases
      keyPhrases.push({ title: trimmed, children: [] });
      processedPhrases.add(trimmed);
      
      // Limit to a reasonable number of key phrases
      if (keyPhrases.length >= 5) return;
    });
    
    // Limit total phrases
    if (keyPhrases.length >= 5) return;
  });
  
  // If we still don't have anything meaningful, create generic sections
  if (keyPhrases.length === 0) {
    return [
      { title: "Key Concepts", children: [] },
      { title: "Main Points", children: [] },
      { title: "Summary", children: [] }
    ];
  }
  
  return keyPhrases;
};