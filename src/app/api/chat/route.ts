import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
	  addMessageToConversation,
	  getOrCreateConversation,
	} from "@/server/services/chat.service";
import { generateChatResponse } from "@/server/services/llm-ai.service";
	import { sendChatCallbackEmail } from "@/server/enquiry-email";

const chatRequestSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      ipAddress: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
});

function extractPhoneFromText(text: string): string | null {
	const match = text.match(/(\+?\d[\d\s\-]{8,15}\d)/);
	if (!match) {
		return null;
	}

	const cleaned = match[1].replace(/[^\d+]/g, "");
	if (cleaned.length < 10 || cleaned.length > 15) {
		return null;
	}

	return cleaned;
}

	function extractEmailFromText(text: string): string | null {
		const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
		return match ? match[0].toLowerCase() : null;
	}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = chatRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { sessionId, message, metadata } = parsed.data;

    // Get or create conversation
    const conversation = await getOrCreateConversation({
      sessionId,
      metadata,
    });

    // Add user message to conversation
    await addMessageToConversation({
      sessionId,
      role: "user",
      content: message,
    });

    // Get updated conversation with all messages
    const updatedConversation = await getOrCreateConversation({ sessionId });

	    // Generate AI response using conversation history
	    const aiResponse = await generateChatResponse(
	      updatedConversation.messages.map((msg) => ({
	        role: msg.role,
	        content: msg.content,
	      })),
	    );

		    // If the latest user message contains a phone number or email, email a callback request
		    const phoneFromChat = extractPhoneFromText(message);
		    const emailFromChat = extractEmailFromText(message);
		    if (phoneFromChat || emailFromChat) {
		      try {
		        await sendChatCallbackEmail({
		          sessionId,
		          phone: phoneFromChat ?? undefined,
		          email: emailFromChat ?? undefined,
		          userMessage: message,
		          aiSummary: aiResponse,
		        });
		      } catch (emailError) {
		        console.error(
		          "[chat-api] Failed to send chat callback email:",
		          emailError,
		        );
		      }
		    }

    // Add AI response to conversation
    await addMessageToConversation({
      sessionId,
      role: "assistant",
      content: aiResponse,
    });

    return NextResponse.json({
      response: aiResponse,
      sessionId,
    });
	  } catch (error) {
	    console.error("[chat-api] Error processing chat request:", error);

	    if (error instanceof Error && error.message === "AI service not configured") {
	      return NextResponse.json(
	        {
	          error: "AI service is not configured. Please contact support.",
	        },
	        { status: 503 },
	      );
	    }

    return NextResponse.json(
      {
        error: "Failed to process chat request",
      },
      { status: 500 },
    );
  }
}

