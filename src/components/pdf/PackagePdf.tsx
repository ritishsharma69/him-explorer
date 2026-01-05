"use client";

import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
} from "@react-pdf/renderer";

// Brand Colors
const BLUE = "#0284C7";
const BLUE_DARK = "#0369A1";
const BLUE_LIGHT = "#E0F2FE";
const GREEN = "#059669";
const GREEN_LIGHT = "#D1FAE5";
const RED = "#DC2626";
const RED_LIGHT = "#FEE2E2";
const SLATE_900 = "#0F172A";
const SLATE_700 = "#334155";
const SLATE_500 = "#64748B";
const SLATE_300 = "#CBD5E1";
const SLATE_100 = "#F1F5F9";

const styles = StyleSheet.create({
	// Page
	page: {
		fontSize: 10,
		paddingTop: 0,
		paddingBottom: 50,
		paddingHorizontal: 0,
		backgroundColor: "#FFFFFF",
	},
	pageContent: {
		paddingHorizontal: 40,
		paddingTop: 25,
	},
	// Header Bar
	headerBar: {
		backgroundColor: BLUE,
		paddingVertical: 15,
		paddingHorizontal: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerLogo: {
		fontSize: 22,
		fontWeight: 700,
		color: "#FFFFFF",
		letterSpacing: 1,
	},
	headerContact: {
		textAlign: "right",
	},
	headerPhone: {
		fontSize: 11,
		fontWeight: 700,
		color: "#FFFFFF",
	},
	headerEmail: {
		fontSize: 9,
		color: "#BAE6FD",
		marginTop: 2,
	},
	// Hero Section
	heroSection: {
		backgroundColor: SLATE_100,
		paddingVertical: 25,
		paddingHorizontal: 40,
		marginBottom: 20,
	},
	badge: {
		backgroundColor: BLUE,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 4,
		alignSelf: "flex-start",
		marginBottom: 12,
	},
	badgeText: {
		fontSize: 8,
		fontWeight: 700,
		color: "#FFFFFF",
		letterSpacing: 1.5,
	},
	heroTitle: {
		fontSize: 26,
		fontWeight: 700,
		color: SLATE_900,
		marginBottom: 6,
		lineHeight: 1.2,
	},
	heroSubtitle: {
		fontSize: 12,
		color: SLATE_500,
		fontStyle: "italic",
		marginBottom: 16,
	},
	// Meta Pills
	metaRow: {
		flexDirection: "row",
		gap: 10,
	},
	metaPill: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: SLATE_300,
	},
	metaPillIcon: {
		fontSize: 10,
		marginRight: 5,
	},
	metaPillText: {
		fontSize: 9,
		color: SLATE_700,
	},
	metaPillValue: {
		fontSize: 9,
		fontWeight: 700,
		color: BLUE,
		marginLeft: 3,
	},
	// Section Title
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 12,
	},
	sectionIcon: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: BLUE_LIGHT,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
	},
	sectionIconText: {
		fontSize: 12,
		color: BLUE,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 700,
		color: SLATE_900,
	},
	// Description
	desc: {
		fontSize: 10,
		color: SLATE_700,
		lineHeight: 1.7,
		marginBottom: 15,
	},
	// Highlights Card
	highlightsCard: {
		backgroundColor: BLUE_LIGHT,
		borderRadius: 8,
		padding: 16,
		marginBottom: 20,
	},
	highlightItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	highlightCheck: {
		fontSize: 10,
		color: BLUE,
		marginRight: 8,
		marginTop: 1,
	},
	highlightText: {
		flex: 1,
		fontSize: 10,
		color: SLATE_700,
		lineHeight: 1.5,
	},
	// Day Card
	dayCard: {
		borderWidth: 1,
		borderColor: SLATE_300,
		borderRadius: 8,
		marginBottom: 12,
		overflow: "hidden",
	},
	dayHeader: {
		backgroundColor: BLUE,
		paddingHorizontal: 14,
		paddingVertical: 8,
		flexDirection: "row",
		alignItems: "center",
	},
	dayNumber: {
		fontSize: 10,
		fontWeight: 700,
		color: "#FFFFFF",
		letterSpacing: 1,
	},
	dayHeaderTitle: {
		fontSize: 11,
		fontWeight: 700,
		color: "#FFFFFF",
		marginLeft: 10,
	},
	dayBody: {
		padding: 14,
		backgroundColor: "#FFFFFF",
	},
	dayDesc: {
		fontSize: 9,
		color: SLATE_500,
		lineHeight: 1.6,
	},
	// Two Column Layout
	twoColumn: {
		flexDirection: "row",
		gap: 15,
		marginBottom: 20,
	},
	column: {
		flex: 1,
	},
	// Box Cards
	inclusionBox: {
		backgroundColor: GREEN_LIGHT,
		borderRadius: 8,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: GREEN,
	},
	exclusionBox: {
		backgroundColor: RED_LIGHT,
		borderRadius: 8,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: RED,
	},
	boxTitle: {
		fontSize: 11,
		fontWeight: 700,
		marginBottom: 12,
		letterSpacing: 1,
	},
	boxTitleGreen: {
		color: GREEN,
	},
	boxTitleRed: {
		color: RED,
	},
	boxItem: {
		flexDirection: "row",
		marginBottom: 6,
	},
	boxBulletGreen: {
		fontSize: 10,
		color: GREEN,
		marginRight: 8,
	},
	boxBulletRed: {
		fontSize: 10,
		color: RED,
		marginRight: 8,
	},
	boxText: {
		flex: 1,
		fontSize: 9,
		color: SLATE_700,
		lineHeight: 1.5,
	},
	// Price Banner
	priceBanner: {
		backgroundColor: BLUE,
		borderRadius: 10,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 15,
	},
	priceLeft: {
		flexDirection: "column",
	},
	priceLabel: {
		fontSize: 10,
		color: "#BAE6FD",
		marginBottom: 4,
	},
	priceValue: {
		fontSize: 24,
		fontWeight: 700,
		color: "#FFFFFF",
	},
	pricePer: {
		fontSize: 10,
		color: "#BAE6FD",
	},
	priceRight: {
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 6,
	},
	priceCtaText: {
		fontSize: 10,
		fontWeight: 700,
		color: BLUE,
	},
	// Footer
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: SLATE_900,
		paddingVertical: 12,
		paddingHorizontal: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	footerBrand: {
		fontSize: 10,
		fontWeight: 700,
		color: "#FFFFFF",
	},
	footerTagline: {
		fontSize: 8,
		color: SLATE_500,
		marginTop: 2,
	},
	footerContact: {
		fontSize: 8,
		color: SLATE_300,
		textAlign: "right",
	},
});

interface ItineraryItem {
	dayNumber: number;
	title: string;
	description: string;
}

export interface PackageForPdf {
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
	heroImageUrl?: string;
}

interface PackagePdfProps {
	pkg: PackageForPdf;
	baseUrl?: string;
}

export function PackagePdf({ pkg }: PackagePdfProps) {
	const price = `₹${pkg.startingPricePerPerson.toLocaleString("en-IN")}`;

	return (
		<Document>
			{/* PAGE 1 - Hero + Overview + Highlights */}
			<Page size="A4" style={styles.page}>
				{/* Header Bar */}
				<View style={styles.headerBar}>
					<Text style={styles.headerLogo}>✦ HimExplore</Text>
					<View style={styles.headerContact}>
						<Text style={styles.headerPhone}>+91 98160 41569</Text>
						<Text style={styles.headerEmail}>himaboratravels@gmail.com</Text>
					</View>
				</View>

				{/* Hero Section */}
				<View style={styles.heroSection}>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>TRAVEL PACKAGE</Text>
					</View>
					<Text style={styles.heroTitle}>{pkg.title}</Text>
					{pkg.subtitle && <Text style={styles.heroSubtitle}>{pkg.subtitle}</Text>}

					{/* Meta Pills */}
					<View style={styles.metaRow}>
						<View style={styles.metaPill}>
							<Text style={styles.metaPillIcon}>📍</Text>
							<Text style={styles.metaPillText}>{pkg.destinationName}</Text>
						</View>
						<View style={styles.metaPill}>
							<Text style={styles.metaPillIcon}>📅</Text>
							<Text style={styles.metaPillValue}>{pkg.durationDays} Days</Text>
						</View>
						<View style={styles.metaPill}>
							<Text style={styles.metaPillIcon}>💰</Text>
							<Text style={styles.metaPillText}>From</Text>
							<Text style={styles.metaPillValue}>{price}</Text>
						</View>
					</View>
				</View>

				{/* Content Area */}
				<View style={styles.pageContent}>
					{/* Short Description */}
					<Text style={styles.desc}>{pkg.shortDescription}</Text>

					{/* Trip Overview */}
					{pkg.detailedDescription && (
						<>
							<View style={styles.sectionHeader}>
								<View style={styles.sectionIcon}>
									<Text style={styles.sectionIconText}>📖</Text>
								</View>
								<Text style={styles.sectionTitle}>Trip Overview</Text>
							</View>
							<Text style={styles.desc}>{pkg.detailedDescription}</Text>
						</>
					)}

					{/* Highlights */}
					{pkg.highlights.length > 0 && (
						<>
							<View style={styles.sectionHeader}>
								<View style={styles.sectionIcon}>
									<Text style={styles.sectionIconText}>✨</Text>
								</View>
								<Text style={styles.sectionTitle}>Trip Highlights</Text>
							</View>
							<View style={styles.highlightsCard}>
								{pkg.highlights.map((item, i) => (
									<View key={i} style={styles.highlightItem}>
										<Text style={styles.highlightCheck}>✓</Text>
										<Text style={styles.highlightText}>{item}</Text>
									</View>
								))}
							</View>
						</>
					)}
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<View>
						<Text style={styles.footerBrand}>HimExplore</Text>
						<Text style={styles.footerTagline}>Your Gateway to Himalayan Adventures</Text>
					</View>
					<Text style={styles.footerContact}>www.himexplore.in | +91 98160 41569</Text>
				</View>
			</Page>

			{/* PAGE 2 - Itinerary */}
			{pkg.itinerary.length > 0 && (
				<Page size="A4" style={styles.page}>
					{/* Header Bar */}
					<View style={styles.headerBar}>
						<Text style={styles.headerLogo}>✦ HimExplore</Text>
						<View style={styles.headerContact}>
							<Text style={styles.headerPhone}>+91 98160 41569</Text>
							<Text style={styles.headerEmail}>himaboratravels@gmail.com</Text>
						</View>
					</View>

					<View style={styles.pageContent}>
						<View style={styles.sectionHeader}>
							<View style={styles.sectionIcon}>
								<Text style={styles.sectionIconText}>🗓</Text>
							</View>
							<Text style={styles.sectionTitle}>Day-by-Day Itinerary</Text>
						</View>

						{pkg.itinerary.map((day) => (
							<View key={day.dayNumber} style={styles.dayCard} wrap={false}>
								<View style={styles.dayHeader}>
									<Text style={styles.dayNumber}>DAY {day.dayNumber}</Text>
									<Text style={styles.dayHeaderTitle}>{day.title}</Text>
								</View>
								<View style={styles.dayBody}>
									<Text style={styles.dayDesc}>{day.description}</Text>
								</View>
							</View>
						))}
					</View>

					{/* Footer */}
					<View style={styles.footer}>
						<View>
							<Text style={styles.footerBrand}>HimExplore</Text>
							<Text style={styles.footerTagline}>Your Gateway to Himalayan Adventures</Text>
						</View>
						<Text style={styles.footerContact}>www.himexplore.in | +91 98160 41569</Text>
					</View>
				</Page>
			)}

			{/* PAGE 3 - Inclusions, Exclusions, Price */}
			<Page size="A4" style={styles.page}>
				{/* Header Bar */}
				<View style={styles.headerBar}>
					<Text style={styles.headerLogo}>✦ HimExplore</Text>
					<View style={styles.headerContact}>
						<Text style={styles.headerPhone}>+91 98160 41569</Text>
						<Text style={styles.headerEmail}>himaboratravels@gmail.com</Text>
					</View>
				</View>

				<View style={styles.pageContent}>
					{/* Two Column Layout for Inclusions & Exclusions */}
					<View style={styles.twoColumn}>
						{/* Inclusions */}
						<View style={styles.column}>
							<View style={styles.inclusionBox}>
								<Text style={[styles.boxTitle, styles.boxTitleGreen]}>✓ WHAT'S INCLUDED</Text>
								{pkg.inclusions.map((item, i) => (
									<View key={i} style={styles.boxItem}>
										<Text style={styles.boxBulletGreen}>•</Text>
										<Text style={styles.boxText}>{item}</Text>
									</View>
								))}
							</View>
						</View>

						{/* Exclusions */}
						<View style={styles.column}>
							<View style={styles.exclusionBox}>
								<Text style={[styles.boxTitle, styles.boxTitleRed]}>✗ NOT INCLUDED</Text>
								{pkg.exclusions.map((item, i) => (
									<View key={i} style={styles.boxItem}>
										<Text style={styles.boxBulletRed}>•</Text>
										<Text style={styles.boxText}>{item}</Text>
									</View>
								))}
							</View>
						</View>
					</View>

					{/* Price Banner */}
					<View style={styles.priceBanner}>
						<View style={styles.priceLeft}>
							<Text style={styles.priceLabel}>Starting from</Text>
							<Text style={styles.priceValue}>{price}</Text>
							<Text style={styles.pricePer}>per person</Text>
						</View>
						<View style={styles.priceRight}>
							<Text style={styles.priceCtaText}>BOOK NOW →</Text>
						</View>
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<View>
						<Text style={styles.footerBrand}>HimExplore</Text>
						<Text style={styles.footerTagline}>Your Gateway to Himalayan Adventures</Text>
					</View>
					<Text style={styles.footerContact}>www.himexplore.in | +91 98160 41569</Text>
				</View>
			</Page>
		</Document>
	);
}
