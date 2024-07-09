// @ts-nocheck
/* eslint-disable */

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { db } from '../../../firebaseAdmin'; // Assurez-vous que le chemin est correct

async function getDataFromFirestore(uid: string, projectId: string) {
    try {
      const projectDoc = await db.collection('projects').doc(projectId).get();
      if (!projectDoc.exists) {
        console.log('No matching project.');
        return null;
      }
  
      const projectData = projectDoc.data();
      if (projectData && projectData.users.includes(uid)) {
        return projectData.context;
      } else {
        console.log('User not authorized for this project.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
      return null;
    }
  }
  
  async function fillPdf(inputPdfPath, data) {
    const existingPdfBytes = fs.readFileSync(inputPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const fieldNames = form.getFields().map(field => field.getName());
    console.log('Available fields:', fieldNames);
  
    const fieldMapping = {
      'name': 'name',
      'surname': 'surname',
      'address': 'address',
      'telephone': 'telephone',
      'packing_list': 'packing_list',
      'shipping_marks': 'shipping_marks',
      'packages': 'packages',
      'quantity': 'quantity',
      'invoice': 'invoice',
      'gross_weight': 'gross_weight',
      'cubing': 'cubing',
      'country': 'country',
      'transport': 'transport',
      'productor_name': 'productor_name',
      'prices': 'prices',
      'port_ladding': 'port_ladding',
      'total': 'total'
    };
    // KEY PART : Remplit les champs du formulaire PDF avec les données de Firestore
    for (let [firestoreField, pdfField] of Object.entries(fieldMapping)) {
      if (data[firestoreField] && fieldNames.includes(pdfField)) {
        form.getTextField(pdfField).setText(data[firestoreField].toString());
        console.log(`✅ Field "${pdfField}" is found in the PDF. It's setting up with "${data[firestoreField]}"`)
      } else {
        console.warn(`Field "${pdfField}" not found in the PDF.`);
      }
    }
  
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
  
  export async function POST(req) {
    const { templateName, uid, projectId } = await req.json();
    if (!templateName || !uid || !projectId) {
      return NextResponse.json({ message: 'Template name, UID, and project ID are required' }, { status: 400 });
    }
  
    try {
      const inputDir = path.join(process.cwd(), 'documents/input_pdf');
      const inputPdfPath = path.join(inputDir, templateName);
      if (!fs.existsSync(inputPdfPath)) {
        return NextResponse.json({ message: 'Template not found' }, { status: 404 });
      }
  
      const context = await getDataFromFirestore(uid, projectId);
      if (context) {
        const pdfBytes = await fillPdf(inputPdfPath, context);

        if (typeof templateName !== 'string') {
          return NextResponse.json({ message: 'Invalid template name' }, { status: 400 });
        }
  
        const response = new NextResponse(Buffer.from(pdfBytes), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${templateName}"`,
          },
        });
  
        return response;
      } else {
        return NextResponse.json({ message: 'No records found or user not authorized in Firestore.' }, { status: 404 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }