import nodemailer from "nodemailer";

import type { EnquiryDocument } from "@/server/models/enquiry.model";

const smtpHost = process.env.SMTP_HOST;
const rawPort = process.env.SMTP_PORT;
const smtpPort = rawPort && !Number.isNaN(Number(rawPort)) ? Number(rawPort) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const notifyEmail = process.env.ENQUIRY_NOTIFY_EMAIL;

if (!smtpHost || !smtpUser || !smtpPass || !notifyEmail) {
	console.warn(
		"[enquiry-email] SMTP not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ENQUIRY_NOTIFY_EMAIL to enable enquiry notifications.",
	);
}

const transporter =
	smtpHost && smtpUser && smtpPass && notifyEmail
		? nodemailer.createTransport({
		    host: smtpHost,
		    port: smtpPort,
		    secure: smtpPort === 465,
		    auth: {
		      user: smtpUser,
		      pass: smtpPass,
		    },
		  })
		: null;

export async function sendEnquiryNotificationEmail(
	enquiry: EnquiryDocument,
): Promise<void> {
	if (!transporter || !notifyEmail) {
		return;
	}

	const peopleSummary =
		`${enquiry.numberOfAdults} adult(s)` +
		(enquiry.numberOfChildren && enquiry.numberOfChildren > 0
		  ? `, ${enquiry.numberOfChildren} child(ren)`
		  : "");

	const preferredDate =
		enquiry.preferredStartDate instanceof Date
		  ? enquiry.preferredStartDate.toISOString().split("T")[0]
		  : "Not specified";

	const budget =
		typeof enquiry.budgetPerPersonMin === "number"
		  ? `₹${enquiry.budgetPerPersonMin.toLocaleString("en-IN")}`
		  : "Not specified";

	const subject = `New HimExplore enquiry from ${enquiry.fullName}`;

	const text = `You have a new trip enquiry on HimExplore.

Guest: ${enquiry.fullName}
Email: ${enquiry.email}
Phone: ${enquiry.phoneCountryCode} ${enquiry.phoneNumber}

People: ${peopleSummary}
Preferred start date: ${preferredDate}
Budget per person (min): ${budget}
How did they hear about you: ${enquiry.howDidYouHear ?? "Not specified"}

Message:
${enquiry.message}
`;

	const html = `<!doctype html>
<html>
	<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color:#f9fafb; padding:16px;">
		<table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
			<tr>
				<td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
					<h1 style="margin:0;font-size:18px;color:#111827;">New trip enquiry</h1>
					<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">A guest has requested a callback on HimExplore.</p>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 20px;">
					<h2 style="margin:0 0 8px;font-size:15px;color:#111827;">Guest details</h2>
					<p style="margin:2px 0;font-size:13px;color:#111827;"><strong>Name:</strong> ${enquiry.fullName}</p>
					<p style="margin:2px 0;font-size:13px;color:#111827;"><strong>Email:</strong> ${enquiry.email}</p>
					<p style="margin:2px 0 10px;font-size:13px;color:#111827;"><strong>Phone:</strong> ${enquiry.phoneCountryCode} ${enquiry.phoneNumber}</p>

					<h2 style="margin:0 0 8px;font-size:15px;color:#111827;">Trip details</h2>
					<p style="margin:2px 0;font-size:13px;color:#111827;"><strong>People:</strong> ${peopleSummary}</p>
					<p style="margin:2px 0;font-size:13px;color:#111827;"><strong>Preferred start date:</strong> ${preferredDate}</p>
					<p style="margin:2px 0;font-size:13px;color:#111827;"><strong>Budget per person (min):</strong> ${budget}</p>
					<p style="margin:2px 0 10px;font-size:13px;color:#111827;"><strong>How they heard about you:</strong> ${enquiry.howDidYouHear ?? "Not specified"}</p>

					<h2 style="margin:0 0 8px;font-size:15px;color:#111827;">Guest message</h2>
					<p style="margin:2px 0;font-size:13px;white-space:pre-line;color:#111827;">${enquiry.message}</p>
				</td>
			</tr>
			<tr>
				<td style="padding:10px 20px;background:#f3f4f6;font-size:11px;color:#9ca3af;">
					You are receiving this email because someone filled the enquiry form on HimExplore.
				</td>
			</tr>
		</table>
	</body>
</html>`;

	try {
		await transporter.sendMail({
			from: `"The Him Explorer" <${smtpUser}>`,
			to: notifyEmail,
			subject,
			text,
			html,
		});
	} catch (error) {
		console.error("[enquiry-email] Failed to send enquiry notification email", error);
	}
}

interface ChatCallbackEmailPayload {
	sessionId: string;
		phone?: string;
		email?: string;
	userMessage: string;
	aiSummary: string;
}

export async function sendChatCallbackEmail(
	payload: ChatCallbackEmailPayload,
): Promise<void> {
	if (!transporter || !notifyEmail) {
		return;
	}

		const subject = `New HimExplore chatbot callback request`;

		const contactLines: string[] = [
			`Session ID: ${payload.sessionId}`,
		];
		if (payload.phone) {
			contactLines.push(`Phone: ${payload.phone}`);
		}
		if (payload.email) {
			contactLines.push(`Email: ${payload.email}`);
		}

		const text = `A visitor requested a callback via the HimExplore chatbot.
		
		${contactLines.join("\n")}
		
		User message:
		${payload.userMessage}
		
		AI summary to help you prepare:
		${payload.aiSummary}
		`;

	const html = `<!doctype html>
<html>
	<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color:#f9fafb; padding:16px;">
		<table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
			<tr>
				<td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
						<h1 style="margin:0;font-size:18px;color:#111827;">New chatbot callback request</h1>
						<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">A guest has shared their contact details and trip information via the HimExplore assistant.</p>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 20px;">
					<p style="margin:0 0 8px;font-size:13px;color:#111827;"><strong>Session ID:</strong> ${payload.sessionId}</p>
					${payload.phone ? `<p style="margin:0 0 8px;font-size:13px;color:#111827;"><strong>Phone:</strong> ${payload.phone}</p>` : ""}
					${payload.email ? `<p style=\"margin:0 0 8px;font-size:13px;color:#111827;\"><strong>Email:</strong> ${payload.email}</p>` : ""}
					<h2 style="margin:16px 0 6px;font-size:15px;color:#111827;">User message</h2>
					<p style="margin:0 0 10px;font-size:13px;white-space:pre-line;color:#111827;">${payload.userMessage}</p>
					<h2 style="margin:16px 0 6px;font-size:15px;color:#111827;">AI summary (for planner)</h2>
					<p style="margin:0;font-size:13px;white-space:pre-line;color:#111827;">${payload.aiSummary}</p>
				</td>
			</tr>
			<tr>
				<td style="padding:10px 20px;background:#f3f4f6;font-size:11px;color:#9ca3af;">
					You are receiving this email because someone used the HimExplore chatbot and requested a callback.
				</td>
			</tr>
		</table>
	</body>
</html>`;

	try {
		await transporter.sendMail({
			from: `"The Him Explorer" <${smtpUser}>`,
			to: notifyEmail,
			subject,
			text,
			html,
		});
	} catch (error) {
		console.error("[enquiry-email] Failed to send chat callback email", error);
	}
}

