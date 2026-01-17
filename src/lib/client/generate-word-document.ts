"use client";

import { Document, Paragraph, TextRun, AlignmentType, Packer, convertInchesToTwip } from "docx";
import { saveAs } from "file-saver";

interface ItineraryItem {
	dayNumber: number;
	title: string;
	description: string;
}

export interface PackageForWord {
	_id: string;
	slug: string;
	title: string;
	subtitle?: string;
	destinationName: string;
	durationDays: number;
	startingPricePerPerson: number;
	currencyCode: string;
	shortDescription: string;
	detailedDescription?: string;
	highlights: string[];
	inclusions: string[];
	exclusions: string[];
	itinerary: ItineraryItem[];
	galleryImageUrls?: string[];
}

// Colors
const BLUE = "0284C7";
const RED = "DC2626";
const BLACK = "1E293B";
const GRAY = "64748B";

export async function generatePackageWordDocument(pkg: PackageForWord): Promise<void> {
	const price = `₹${pkg.startingPricePerPerson.toLocaleString("en-IN")}`;

	// Build all content as simple paragraphs
	const children: Paragraph[] = [];

	// ===== TITLE =====
	children.push(
		new Paragraph({
			spacing: { after: 120 },
			children: [
				new TextRun({ text: pkg.title, bold: true, size: 56, color: BLACK }),
			],
		})
	);

	// Subtitle
	if (pkg.subtitle) {
		children.push(
			new Paragraph({
				spacing: { after: 120 },
				children: [
					new TextRun({ text: pkg.subtitle, italics: true, size: 26, color: GRAY }),
				],
			})
		);
	}

	// Meta line: Destination • Days • Price
	children.push(
		new Paragraph({
			spacing: { after: 300 },
			children: [
				new TextRun({ text: pkg.destinationName, size: 22, color: GRAY }),
				new TextRun({ text: "   •   ", size: 22, color: GRAY }),
				new TextRun({ text: `${pkg.durationDays} DAYS`, bold: true, size: 22, color: BLUE }),
				new TextRun({ text: "   •   ", size: 22, color: GRAY }),
				new TextRun({ text: `From ${price} per person`, bold: true, size: 22, color: BLUE }),
			],
		})
	);

	// Short description
	children.push(
		new Paragraph({
			spacing: { after: 400 },
			children: [
				new TextRun({ text: pkg.shortDescription, size: 24, color: BLACK }),
			],
		})
	);

	// ===== TRIP OVERVIEW =====
	if (pkg.detailedDescription) {
		children.push(
			new Paragraph({
				spacing: { before: 200, after: 150 },
				children: [
					new TextRun({ text: "Trip overview", bold: true, size: 32, color: BLACK }),
				],
			})
		);
		children.push(
			new Paragraph({
				spacing: { after: 300 },
				children: [
					new TextRun({ text: pkg.detailedDescription, size: 22, color: GRAY }),
				],
			})
		);
	}

	// ===== HIGHLIGHTS =====
	if (pkg.highlights.length > 0) {
		children.push(
			new Paragraph({
				spacing: { before: 200, after: 150 },
				children: [
					new TextRun({ text: "Highlights", bold: true, size: 32, color: BLACK }),
				],
			})
		);
		for (const item of pkg.highlights) {
			children.push(
				new Paragraph({
					spacing: { after: 80 },
					bullet: { level: 0 },
					children: [
						new TextRun({ text: item, size: 22, color: GRAY }),
					],
				})
			);
		}
	}

	// ===== DAY-WISE PLAN =====
	if (pkg.itinerary.length > 0) {
		children.push(
			new Paragraph({
				spacing: { before: 300, after: 200 },
				children: [
					new TextRun({ text: "Day-wise plan", bold: true, size: 32, color: BLACK }),
				],
			})
		);

		for (const day of pkg.itinerary) {
			// Day header
			children.push(
				new Paragraph({
					spacing: { before: 200, after: 80 },
					children: [
						new TextRun({ text: `DAY ${day.dayNumber}`, bold: true, size: 20, color: BLUE }),
					],
				})
			);
			// Day title
			children.push(
				new Paragraph({
					spacing: { after: 80 },
					children: [
						new TextRun({ text: day.title, bold: true, size: 24, color: BLACK }),
					],
				})
			);
			// Day description
			children.push(
				new Paragraph({
					spacing: { after: 200 },
					children: [
						new TextRun({ text: day.description, size: 22, color: GRAY }),
					],
				})
			);
		}
	}


	// ===== INCLUSIONS =====
	if (pkg.inclusions.length > 0) {
		children.push(
			new Paragraph({
				spacing: { before: 300, after: 150 },
				children: [
					new TextRun({ text: "INCLUSIONS", bold: true, size: 26, color: BLUE }),
				],
			})
		);
		for (const item of pkg.inclusions) {
			children.push(
				new Paragraph({
					spacing: { after: 60 },
					bullet: { level: 0 },
					children: [
						new TextRun({ text: item, size: 22, color: GRAY }),
					],
				})
			);
		}
	}

	// ===== EXCLUSIONS =====
	if (pkg.exclusions.length > 0) {
		children.push(
			new Paragraph({
				spacing: { before: 300, after: 150 },
				children: [
					new TextRun({ text: "EXCLUSIONS", bold: true, size: 26, color: RED }),
				],
			})
		);
		for (const item of pkg.exclusions) {
			children.push(
				new Paragraph({
					spacing: { after: 60 },
					bullet: { level: 0 },
					children: [
						new TextRun({ text: item, size: 22, color: GRAY }),
					],
				})
			);
		}
	}

	// ===== FOOTER =====
	children.push(
		new Paragraph({
			spacing: { before: 400 },
			alignment: AlignmentType.CENTER,
			children: [
				new TextRun({ text: "─────────────────────────────────────────────", size: 20, color: GRAY }),
			],
		})
	);
	children.push(
		new Paragraph({
			alignment: AlignmentType.CENTER,
			spacing: { before: 100 },
			children: [
				new TextRun({ text: "HimExplore", bold: true, size: 28, color: BLACK }),
				new TextRun({ text: " — Your Gateway to Himalayan Adventures", size: 22, color: GRAY }),
			],
		})
	);
	children.push(
		new Paragraph({
			alignment: AlignmentType.CENTER,
			children: [
				new TextRun({ text: "www.himexplore.in  |  +91 98160 41569", size: 20, color: GRAY }),
			],
		})
	);

	// ===== CREATE DOCUMENT =====
	const doc = new Document({
		styles: {
			default: {
				document: {
					run: { font: "Calibri" },
				},
			},
		},
		numbering: {
			config: [
				{
					reference: "bullet-points",
					levels: [
						{
							level: 0,
							format: "bullet",
							text: "•",
							alignment: AlignmentType.LEFT,
							style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) } } },
						},
					],
				},
			],
		},
		sections: [
			{
				properties: {
					page: {
						margin: {
							top: convertInchesToTwip(0.75),
							bottom: convertInchesToTwip(0.75),
							left: convertInchesToTwip(0.75),
							right: convertInchesToTwip(0.75),
						},
					},
				},
				children: children,
			},
		],
	});

	const blob = await Packer.toBlob(doc);
	const safeName = pkg.title.replace(/[^a-zA-Z0-9]/g, "_");
	saveAs(blob, `HimExplore_${safeName}.docx`);
}