import { GoogleGenerativeAI } from "@google/generative-ai";
import { listPublishedPackages } from "./package.service";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "[gemini-ai] GEMINI_API_KEY not configured. AI chatbot will not work.",
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini AI not configured");
  }

  // Get package data for context
  const packages = await listPublishedPackages();

  // Build context about available packages
  const packageContext = packages
    .map(
      (pkg) =>
        `- ${pkg.title} (${pkg.destinationName}): ${pkg.durationDays} days, starting from ₹${pkg.startingPricePerPerson.toLocaleString("en-IN")} per person. ${pkg.shortDescription}`,
    )
    .join("\n");

  // System prompt for the AI
  const systemPrompt = `You are a friendly and knowledgeable Himachal Pradesh travel assistant for HimExplore, a travel company specializing in Himachal trips.

Your role:
- Help users plan their Himachal Pradesh trips
- Suggest suitable packages based on their preferences, budget, and travel dates
- Provide information about destinations, activities, and travel tips
- Answer questions about our packages, pricing, and inclusions
- Be warm, helpful, and conversational
- Keep responses concise (2-3 sentences max unless detailed info is requested)
- Use Indian Rupees (₹) for pricing
- Encourage users to share their contact details for personalized planning

Available packages:
${packageContext}

Key destinations we cover:
- Manali (adventure, honeymoon, family trips)
- Shimla & Kasauli (weekend getaways, colonial charm)
- Spiti Valley (high-altitude adventure, 6-9 days recommended)
- Dharamshala & McLeod Ganj (spiritual, Tibetan culture)
- Jibhi, Bir, Tirthan (offbeat, workations, nature)
- Kasol & Parvati Valley (backpacker, trekking)

Travel tips:
- Best time: March-June (summer), October-February (snow)
- Monsoon (July-September) can have landslides
- Spiti needs permits and acclimatization
- Budget trips start from ₹8,000-12,000 per person for 3-4 days
- Luxury trips can go up to ₹25,000+ per person

Always be helpful and try to understand user needs before suggesting packages.`;

  // Convert chat history to Gemini format
  const chatHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const latestMessage = messages[messages.length - 1].content;

	  try {
	    // Use Gemini 2.0 Flash (fast model; actual quota depends on your plan)
	    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

	    const chat = model.startChat({
	      history: [
	        {
	          role: "user",
	          parts: [{ text: systemPrompt }],
	        },
	        {
	          role: "model",
	          parts: [
	            {
	              text: "Understood! I'm your HimExplore travel assistant, ready to help plan amazing Himachal trips. I'll be friendly, concise, and focus on understanding traveler needs before suggesting our packages.",
	            },
	          ],
	        },
	        ...chatHistory,
	      ],
	    });

	    const result = await chat.sendMessage(latestMessage);
	    const response = result.response;
	    const text = response.text();

	    return text;
	  } catch (error) {
	    console.error("[gemini-ai] Error generating response:", error);

	    // If we've hit a quota / rate-limit error or similar, return a
	    // graceful fallback message instead of breaking the chat API.
	    let fallbackMessage =
	      "I'm having trouble connecting to the AI service right now. Please try again in a little while.";

	    if (
	      error instanceof Error &&
	      (error.message.includes("429") ||
	        error.message.toLowerCase().includes("quota") ||
	        error.message.toLowerCase().includes("rate limit"))
	    ) {
	      fallbackMessage =
	        "Our AI assistant is temporarily unavailable because we've hit our usage limit. Please try again in a bit, or share your trip details and we'll help you manually.";
	    }

	    return fallbackMessage;
	  }
}

