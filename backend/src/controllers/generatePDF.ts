import db from "../configurations/db";
import { Request, Response } from "express";
import fs from 'fs';
import PDFDocument from 'pdfkit'



export const generateFilePDF = async (req: Request, res: Response): Promise<any> => {
    const fileId = req.params.id;
  
    try {
      const fileQuery = await db`SELECT * FROM files WHERE id = ${fileId}`;
      const file = fileQuery[0];
  
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      const forwardersQuery = await db`SELECT * FROM actions WHERE file_id = ${fileId}`;
    
      // Initialize PDF document
      const doc = new PDFDocument({ margin: 40 });
      const filePath = `uploads/${file.id}_file_details.pdf`;
  
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
  
      // Add header
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('File Details Report', { align: 'center', underline: true })
        .moveDown(1);
  
      // Add file details
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`Date:`, { continued: true })
        .font('Helvetica')
        .text(` ${file.created_at.toLocaleDateString() }`)
        .moveDown(0.5);
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`File ID:`, { continued: true })
        .font('Helvetica')
        .text(` ${file.id}`)
        .moveDown(0.5);
  
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`File Title:`, { continued: true })
        .font('Helvetica')
        .text(` ${file.title}`)
        .moveDown(0.5);
  
      doc
        .font('Helvetica-Bold')
        .text(``, { continued: true })
        .font('Helvetica')
        .text(` ${file.content}`)
        .moveDown(1.5);
  
      // Add forwarders details
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Action Details', { underline: true })
        .moveDown(1);
        const leftWidth = 250; // Reserved width for the left column
        const rightX = doc.page.width - leftWidth - 40; // Position for the right column
        
        for (const forwarder of forwardersQuery) {
            const senderDesignation = await db`SELECT designations.designation_name FROM designations INNER JOIN dtu ON designations.id = dtu.id WHERE dtu.username = ${forwarder.from_user}`;
            const receiverDesignation = await db`SELECT designations.designation_name FROM designations INNER JOIN dtu ON designations.id = dtu.id WHERE dtu.username = ${forwarder.to_user}`;
           console.log(senderDesignation,receiverDesignation,"for pdf")
       
        
        
    // Left side: Forwarded By, Remarks, and Date
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Forwarded By: ${senderDesignation[0].designation}`, 40, doc.y, { width: leftWidth, align: 'left' });
  
  
    doc
      .text(`Date: ${forwarder.created_at ? new Date(forwarder.created_at).toLocaleDateString() : 'Invalid Date'}`, 40, doc.y, { width: leftWidth, align: 'left' }) // Increased spacing here
      .moveDown(5);
  
    // Right side: Forwarded To
    const y = doc.y - 80; // Align the right content with the top of the left column
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Forwarded To: ${receiverDesignation[0].designation}`, rightX, y, { width: leftWidth, align: 'left' })
  
  
      doc
      .text(`Remarks: ${forwarder.remarks || 'N/A'}`, rightX, y+10, { width: leftWidth, align: 'left' })// Increased spacing here
      .moveDown(2);
  
  };
  
  
      doc.end();
  
      // Wait for the file to be written
      writeStream.on('finish', () => {
        res.download(filePath, 'file_details.pdf', (err) => {
          if (err) {
            console.error('Error downloading PDF:', err);
            res.status(500).send('Error downloading PDF');
          }
          fs.unlinkSync(filePath); // Clean up after sending
        });
      });
  
      writeStream.on('error', (err) => {
        console.error('File write error:', err);
        res.status(500).send('Error generating PDF');
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Error generating PDF' });
    }
  };
  