"use client";

import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
	Font,
} from "@react-pdf/renderer";

// Register fonts for better typography
Font.register({
	family: "Roboto",
	fonts: [
		{ src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf", fontWeight: 400 },
		{ src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf", fontWeight: 700 },
	],
});

const styles = StyleSheet.create({
	page: {
		fontFamily: "Roboto",
		fontSize: 11,
		paddingTop: 30,
		paddingBottom: 50,
		paddingHorizontal: 40,
		backgroundColor: "#FFFFFF",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 25,
		paddingBottom: 15,
		borderBottomWidth: 2,
		borderBottomColor: "#2563EB",
	},
	logo: {
		width: 120,
		height: 40,
		objectFit: "contain",
	},
	contactInfo: {
		textAlign: "right",
	},
	contactText: {
		fontSize: 10,
		color: "#64748B",
	},
	contactPhone: {
		fontSize: 12,
		fontWeight: 700,
		color: "#1E293B",
	},
	badge: {
		backgroundColor: "#2563EB",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 4,
		alignSelf: "flex-start",
		marginBottom: 8,
	},
	badgeText: {
		color: "#FFFFFF",
		fontSize: 8,
		fontWeight: 700,
		letterSpacing: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: 700,
		color: "#0F172A",
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 13,
		color: "#64748B",
		marginBottom: 15,
	},
	metaRow: {
		flexDirection: "row",
		gap: 20,
		marginBottom: 20,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#E2E8F0",
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
	metaLabel: {
		fontSize: 10,
		color: "#64748B",
	},
	metaValue: {
		fontSize: 11,
		fontWeight: 700,
		color: "#2563EB",
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 700,
		color: "#0F172A",
		marginTop: 20,
		marginBottom: 10,
	},
	paragraph: {
		fontSize: 11,
		color: "#334155",
		lineHeight: 1.6,
		marginBottom: 10,
	},
	bulletList: {
		marginLeft: 10,
		marginBottom: 15,
	},
	bulletItem: {
		flexDirection: "row",
		marginBottom: 6,
	},
	bullet: {
		width: 15,
		fontSize: 11,
		color: "#2563EB",
	},
	bulletText: {
		flex: 1,
		fontSize: 11,
		color: "#334155",
	},
	daySection: {
		marginBottom: 15,
	},
	dayHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
	},
	dayDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#2563EB",
		marginRight: 8,
	},
	dayLabel: {
		fontSize: 9,
		color: "#2563EB",
		fontWeight: 700,
		letterSpacing: 1,
	},
	dayTitle: {
		fontSize: 13,
		fontWeight: 700,
		color: "#0F172A",
		marginLeft: 16,
		marginBottom: 4,
	},
	dayDescription: {
		fontSize: 10,
		color: "#64748B",
		marginLeft: 16,
		lineHeight: 1.5,
	},
	sectionBox: {
		backgroundColor: "#F8FAFC",
		padding: 15,
		borderRadius: 6,
		marginBottom: 15,
	},
	sectionBoxTitle: {
		fontSize: 11,
		fontWeight: 700,
		color: "#2563EB",
		marginBottom: 10,
		letterSpacing: 0.5,
	},
});

const costStyles = StyleSheet.create({
	costRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 6,
		borderBottomWidth: 1,
		borderBottomColor: "#E2E8F0",
	},
	costLabel: {
		fontSize: 11,
		color: "#334155",
	},
	costValue: {
		fontSize: 11,
		color: "#0F172A",
		fontWeight: 700,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 10,
		marginTop: 5,
		backgroundColor: "#2563EB",
		paddingHorizontal: 10,
		borderRadius: 4,
	},
	totalLabel: {
		fontSize: 12,
		color: "#FFFFFF",
		fontWeight: 700,
	},
	totalValue: {
		fontSize: 14,
		color: "#FFFFFF",
		fontWeight: 700,
	},
	footer: {
		position: "absolute",
		bottom: 20,
		left: 40,
		right: 40,
		textAlign: "center",
		color: "#94A3B8",
		fontSize: 9,
		borderTopWidth: 1,
		borderTopColor: "#E2E8F0",
		paddingTop: 10,
	},
	notesBox: {
		minHeight: 60,
		backgroundColor: "#F8FAFC",
		padding: 15,
		borderRadius: 6,
		marginBottom: 15,
	},
	emptyLine: {
		height: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#E2E8F0",
		borderBottomStyle: "dashed",
		marginBottom: 8,
	},
});

interface TripPdfProps {
	enquiry: {
		fullName: string;
		email: string;
		phoneCountryCode: string;
		phoneNumber: string;
		numberOfAdults: number;
		numberOfChildren: number;
		preferredStartDate?: string;
		budgetPerPersonMin?: number;
		message?: string;
		howDidYouHear?: string;
		createdAt: string;
	};
	formatDate: (date: string) => string;
}

export function TripCustomizationPdf({ enquiry, formatDate }: TripPdfProps) {
	const tripDate = enquiry.preferredStartDate
		? formatDate(enquiry.preferredStartDate)
		: "Not specified";
	const budget = enquiry.budgetPerPersonMin
		? `₹${enquiry.budgetPerPersonMin.toLocaleString("en-IN")}`
		: "Not specified";
	const totalPeople = enquiry.numberOfAdults + enquiry.numberOfChildren;

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header with Logo and Contact */}
				<View style={styles.header}>
					<Image src="/logo.png" style={styles.logo} />
					<View style={styles.contactInfo}>
						<Text style={styles.contactPhone}>+91 98160 41569</Text>
						<Text style={styles.contactText}>himaboratravels@gmail.com</Text>
						<Text style={styles.contactText}>www.himexplore.in</Text>
					</View>
				</View>

				{/* Badge */}
				<View style={styles.badge}>
					<Text style={styles.badgeText}>CUSTOM TRIP PROPOSAL</Text>
				</View>

				{/* Title */}
				<Text style={styles.title}>Trip for {enquiry.fullName}</Text>
				<Text style={styles.subtitle}>Personalized travel experience crafted just for you</Text>

				{/* Meta Info Row */}
				<View style={styles.metaRow}>
					<View style={styles.metaItem}>
						<Text style={styles.metaLabel}>Travelers:</Text>
						<Text style={styles.metaValue}>{totalPeople} People</Text>
					</View>
					<View style={styles.metaItem}>
						<Text style={styles.metaLabel}>Start Date:</Text>
						<Text style={styles.metaValue}>{tripDate}</Text>
					</View>
					<View style={styles.metaItem}>
						<Text style={styles.metaLabel}>Budget:</Text>
						<Text style={styles.metaValue}>{budget}/person</Text>
					</View>
				</View>

				{/* Guest Details */}
				<View style={styles.sectionBox}>
					<Text style={styles.sectionBoxTitle}>GUEST DETAILS</Text>
					<View style={styles.bulletList}>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>Name: {enquiry.fullName}</Text>
						</View>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>Email: {enquiry.email}</Text>
						</View>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>Phone: {enquiry.phoneCountryCode} {enquiry.phoneNumber}</Text>
						</View>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>Adults: {enquiry.numberOfAdults} | Children: {enquiry.numberOfChildren}</Text>
						</View>
					</View>
				</View>

				{/* Guest Message */}
				{enquiry.message && (
					<>
						<Text style={styles.sectionTitle}>Guest Requirements</Text>
						<Text style={styles.paragraph}>{enquiry.message}</Text>
					</>
				)}

				{/* Day-wise Plan */}
				<Text style={styles.sectionTitle}>Day-wise Plan</Text>

				<View style={styles.daySection}>
					<View style={styles.dayHeader}>
						<View style={styles.dayDot} />
						<Text style={styles.dayLabel}>DAY 1</Text>
					</View>
					<Text style={styles.dayTitle}>___________________________</Text>
					<Text style={styles.dayDescription}>___________________________________________________</Text>
				</View>

				<View style={styles.daySection}>
					<View style={styles.dayHeader}>
						<View style={styles.dayDot} />
						<Text style={styles.dayLabel}>DAY 2</Text>
					</View>
					<Text style={styles.dayTitle}>___________________________</Text>
					<Text style={styles.dayDescription}>___________________________________________________</Text>
				</View>

				<View style={styles.daySection}>
					<View style={styles.dayHeader}>
						<View style={styles.dayDot} />
						<Text style={styles.dayLabel}>DAY 3</Text>
					</View>
					<Text style={styles.dayTitle}>___________________________</Text>
					<Text style={styles.dayDescription}>___________________________________________________</Text>
				</View>

				{/* Footer */}
				<Text style={costStyles.footer}>
					HimExplore - Your Gateway to Himalayan Adventures | Generated on {formatDate(new Date().toISOString())}
				</Text>
			</Page>

			{/* Page 2 - Cost & Details */}
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Image src="/logo.png" style={styles.logo} />
					<View style={styles.contactInfo}>
						<Text style={styles.contactPhone}>+91 98160 41569</Text>
						<Text style={styles.contactText}>himaboratravels@gmail.com</Text>
					</View>
				</View>

				{/* Inclusions */}
				<View style={styles.sectionBox}>
					<Text style={styles.sectionBoxTitle}>INCLUSIONS</Text>
					<View style={styles.bulletList}>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>_________________________________</Text>
						</View>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>_________________________________</Text>
						</View>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>_________________________________</Text>
						</View>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>_________________________________</Text>
						</View>
					</View>
				</View>

				{/* Exclusions */}
				<View style={styles.sectionBox}>
					<Text style={[styles.sectionBoxTitle, { color: "#DC2626" }]}>EXCLUSIONS</Text>
					<View style={styles.bulletList}>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>_________________________________</Text>
						</View>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>_________________________________</Text>
						</View>
						<View style={styles.bulletItem}>
							<Text style={styles.bullet}>•</Text>
							<Text style={styles.bulletText}>_________________________________</Text>
						</View>
					</View>
				</View>

				{/* Cost Breakdown */}
				<Text style={styles.sectionTitle}>Cost Breakdown</Text>
				<View style={{ marginBottom: 15 }}>
					<View style={costStyles.costRow}>
						<Text style={costStyles.costLabel}>Accommodation</Text>
						<Text style={costStyles.costValue}>₹ _________</Text>
					</View>
					<View style={costStyles.costRow}>
						<Text style={costStyles.costLabel}>Transport</Text>
						<Text style={costStyles.costValue}>₹ _________</Text>
					</View>
					<View style={costStyles.costRow}>
						<Text style={costStyles.costLabel}>Activities</Text>
						<Text style={costStyles.costValue}>₹ _________</Text>
					</View>
					<View style={costStyles.costRow}>
						<Text style={costStyles.costLabel}>Meals</Text>
						<Text style={costStyles.costValue}>₹ _________</Text>
					</View>
					<View style={costStyles.costRow}>
						<Text style={costStyles.costLabel}>Other Expenses</Text>
						<Text style={costStyles.costValue}>₹ _________</Text>
					</View>
					<View style={costStyles.totalRow}>
						<Text style={costStyles.totalLabel}>TOTAL</Text>
						<Text style={costStyles.totalValue}>₹ _________</Text>
					</View>
				</View>

				{/* Notes */}
				<Text style={styles.sectionTitle}>Notes / Special Requests</Text>
				<View style={costStyles.notesBox}>
					<View style={costStyles.emptyLine} />
					<View style={costStyles.emptyLine} />
					<View style={costStyles.emptyLine} />
				</View>

				{/* Footer */}
				<Text style={costStyles.footer}>
					HimExplore - Your Gateway to Himalayan Adventures | Generated on {formatDate(new Date().toISOString())}
				</Text>
			</Page>
		</Document>
	);
}

