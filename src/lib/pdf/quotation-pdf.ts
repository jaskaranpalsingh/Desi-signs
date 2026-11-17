import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import type { CustomerQuotationItem, QuoteRequestItem, WebsiteSettings } from '../types';
import { moneyCad } from '../quote-management-types';

function projectRoot(): string {
  return process.cwd();
}

function logoPath(): string | null {
  const candidates = [
    path.join(projectRoot(), 'public', 'logo.png'),
    path.join(projectRoot(), 'public', 'logo.jpg'),
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

export async function buildQuotationPdfBuffer(opts: {
  quotation: CustomerQuotationItem;
  request: QuoteRequestItem;
  settings: WebsiteSettings;
}): Promise<Buffer> {
  const { quotation, request, settings } = opts;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 48 });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const brandRed = '#D71920';
    const ink = '#111111';
    const muted = '#596579';

    const logo = logoPath();
    if (logo) {
      try {
        doc.image(logo, 48, 40, { height: 36 });
      } catch {
        doc.fillColor(brandRed).fontSize(18).font('Helvetica-Bold').text('DESI SIGNS', 48, 48);
      }
    } else {
      doc.fillColor(brandRed).fontSize(18).font('Helvetica-Bold').text('DESI SIGNS', 48, 48);
    }

    doc
      .fillColor(muted)
      .fontSize(9)
      .font('Helvetica')
      .text(
        [
          settings.companyName || 'Desi Signs',
          [settings.address, settings.city, settings.province, settings.postalCode]
            .filter(Boolean)
            .join(', '),
          settings.phone || '',
          settings.email || 'save@desisigns.com',
        ]
          .filter(Boolean)
          .join('\n'),
        320,
        42,
        { width: 240, align: 'right' },
      );

    doc.moveDown(2.5);
    doc
      .fillColor(ink)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Quotation', 48, doc.y + 12);

    doc
      .moveDown(0.4)
      .fillColor(muted)
      .fontSize(10)
      .font('Helvetica')
      .text(`Quotation No: ${quotation.quotationNumber}`)
      .text(`Quote Date: ${quotation.quoteDate || '—'}`)
      .text(`Valid Until: ${quotation.expiryDate || '—'}`)
      .text(`Request Ref: ${request.id}`);

    doc.moveDown(1);
    doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Customer');
    doc
      .moveDown(0.3)
      .fillColor(muted)
      .fontSize(10)
      .font('Helvetica')
      .text(quotation.customerName || request.fullName)
      .text(quotation.businessName || request.businessName)
      .text(quotation.customerEmail || request.email)
      .text(quotation.customerPhone || request.phone)
      .text(quotation.customerLocation || request.location);

    doc.moveDown(1);
    doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Sign Specifications');
    doc
      .moveDown(0.3)
      .fillColor(muted)
      .fontSize(10)
      .font('Helvetica')
      .text(quotation.signSpecifications || request.signType, { width: 500 });

    if (quotation.materials?.trim()) {
      doc.moveDown(0.6);
      doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Materials');
      doc
        .moveDown(0.3)
        .fillColor(muted)
        .fontSize(10)
        .font('Helvetica')
        .text(quotation.materials, { width: 500 });
    }

    doc.moveDown(1);
    doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Pricing (CAD)');
    doc.moveDown(0.4);

    const line = (label: string, amount: number) => {
      const y = doc.y;
      doc.fillColor(muted).fontSize(10).font('Helvetica').text(label, 48, y, { width: 340 });
      doc.text(moneyCad(amount), 400, y, { width: 140, align: 'right' });
      doc.moveDown(0.35);
    };

    line('Manufacturing', quotation.manufacturingCost);
    line('Installation', quotation.installationCharges);
    line('Permits', quotation.permitCharges);
    line('Other charges', quotation.otherCharges);
    if (quotation.discount > 0) line('Discount', -quotation.discount);

    doc
      .moveTo(48, doc.y + 2)
      .lineTo(540, doc.y + 2)
      .strokeColor('#E5E7EB')
      .stroke();
    doc.moveDown(0.5);
    line('Subtotal', quotation.subtotal);
    line(`Tax (${quotation.taxRatePercent}%)`, quotation.taxAmount);

    doc.moveDown(0.2);
    const totalY = doc.y;
    doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Total (CAD)', 48, totalY);
    doc.fillColor(brandRed).text(moneyCad(quotation.totalCad), 400, totalY, {
      width: 140,
      align: 'right',
    });

    doc.moveDown(1.4);
    doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Payment Terms');
    doc
      .moveDown(0.3)
      .fillColor(muted)
      .fontSize(10)
      .font('Helvetica')
      .text(quotation.paymentTerms || '—', { width: 500 });

    if (quotation.estimatedCompletion?.trim()) {
      doc.moveDown(0.6);
      doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Estimated Completion');
      doc
        .moveDown(0.3)
        .fillColor(muted)
        .fontSize(10)
        .font('Helvetica')
        .text(quotation.estimatedCompletion);
    }

    if (quotation.additionalNotes?.trim()) {
      doc.moveDown(0.6);
      doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Notes');
      doc
        .moveDown(0.3)
        .fillColor(muted)
        .fontSize(10)
        .font('Helvetica')
        .text(quotation.additionalNotes, { width: 500 });
    }

    doc.moveDown(1);
    doc.fillColor(ink).fontSize(12).font('Helvetica-Bold').text('Terms & Conditions');
    doc
      .moveDown(0.3)
      .fillColor(muted)
      .fontSize(9)
      .font('Helvetica')
      .text(
        [
          'This quotation is based on the information provided at the time of request and is subject to site review.',
          'Prices are in Canadian dollars (CAD) and remain valid until the expiry date shown above.',
          'Fabrication begins after written approval and receipt of the required deposit.',
          'Any changes to size, materials, lighting, or installation scope may adjust the final price.',
          'This document does not create a warranty or certification beyond what is stated in a signed work agreement.',
        ].join('\n'),
        { width: 500, lineGap: 2 },
      );

    if (request.budgetRange?.trim()) {
      doc.moveDown(0.8);
      doc
        .fillColor(muted)
        .fontSize(8)
        .text(
          `Online calculator estimate (reference only, not the approved selling price): ${request.budgetRange}`,
          { width: 500 },
        );
    }

    doc.end();
  });
}
