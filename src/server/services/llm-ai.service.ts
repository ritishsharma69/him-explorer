import { listPublishedPackages } from "./package.service";
import { listPublicHomeCollections } from "./home-collection.service";
import { listPublicPartnerHotels } from "./partner-hotel.service";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn(
    "[llm-ai] GROQ_API_KEY not configured. AI chatbot will not work.",
  );
}

export async function generateChatResponse(
  messages: ChatMessage[],
): Promise<string> {
  if (!apiKey) {
    throw new Error("AI service not configured");
  }

	  // Get live data for context (packages, collections, partner hotels)
	  const [packages, homeCollections, partnerHotels] = await Promise.all([
	    listPublishedPackages(),
	    listPublicHomeCollections(),
	    listPublicPartnerHotels(),
	  ]);

		  // Build rich context about available packages (limit to top 10 for brevity)
		  const topPackages = packages.slice(0, 10);
		  const packageContext =
		    topPackages
		      .map((pkg) => {
		        const highlightsSnippet = pkg.highlights?.length
		          ? `Highlights: ${pkg.highlights.slice(0, 4).join("; ")}.`
		          : "";
		        const inclusionsSnippet = pkg.inclusions?.length
		          ? `Key inclusions: ${pkg.inclusions.slice(0, 3).join("; ")}.`
		          : "";
		        const itinerarySnippet = pkg.itinerary?.length
		          ? `Itinerary sample: ${pkg.itinerary
		              .slice(0, 3)
		              .map(
		                (day) =>
		                  `Day ${day.dayNumber} - ${day.title}: ${day.description}`,
		              )
		              .join(" | ")}.`
		          : "";
		
		        return `- ${pkg.title} (${pkg.destinationName}, ${pkg.durationDays} days, starting from ₹${pkg.startingPricePerPerson.toLocaleString(
		          "en-IN",
		        )} per person)
		Short summary: ${pkg.shortDescription}
		${highlightsSnippet}
		${inclusionsSnippet}
		${itinerarySnippet}`;
		      })
		      .join("\n\n") ||
		    "- Customised travel packages across India including mountains, beaches, heritage sites and more, with stays, transport and sightseeing.";
		
		  const topCollectionsContext =
		    homeCollections.topCollections
		      .map((item) => `- ${item.title}: ${item.subtitle} (badge: ${item.badge})`)
		      .join("\n") ||
		    "- Curated themes like honeymoons, family trips, workations and offbeat getaways across India.";
		
		  const offbeatCollectionsContext =
		    homeCollections.offbeatCollections
		      .map((item) => `- ${item.title}: ${item.subtitle} (badge: ${item.badge})`)
		      .join("\n") ||
		    "- Offbeat valleys and quieter towns like Jibhi, Tirthan, Bir and more for slow, local stays.";
		
		  const partnerHotelsContext =
		    partnerHotels
		      .map((hotel) => `- ${hotel.name}: ${hotel.label}`)
		      .join("\n") ||
		    "- A curated network of reliable homestays, boutique hotels and resorts across India.";

		  // System prompt for the AI
			  const systemPrompt = `You are a friendly and knowledgeable travel assistant for HimExplore, a travel company specializing in curated trips across India.

				Conversation opening:
				- Always start your very first reply with: "Welcome to HimExplore! I'm your trip planner buddy."
				- This welcome line must appear only once in the entire conversation. If you have already used it earlier in this chat, do not repeat it again.
				- Right after hello, ask in one short line: "Are you planning a trip right now?"
				- If they say yes or clearly talk about a trip, ask one simple question like "Which destination or area are you thinking about?" and then quickly ask for their phone number so a human planner can call them.
				- Keep this intro to 2–3 short sentences max, each sentence on its own line.
				
				Language & tone:
				- Chat in simple, clear English only. Do not switch to Hinglish or any other language.
				- Answer in a crisp, confident way: strictly 2–3 short sentences for most replies.
				- Put each sentence on a separate line (no big paragraphs) and avoid filler or over-explaining.
				- Ask at most one or two small questions at a time, like a casual chat – do not bombard the user with long checklists.
				- Never mention databases, systems, configurations, or that "data is not populated" – always speak as if everything is working normally.
				
				Pricing behaviour (very important):
				- By default, do NOT give any rupee amounts or price ranges on your own.
				- Even if the user asks for price or budget, first move the conversation towards getting their phone number so a human planner can share an exact quote.
				- You may describe options in words like "budget", "mid-range" or "premium", but avoid writing specific ₹ numbers unless you are explicitly instructed otherwise.
				- Always explain briefly that final price depends on dates, hotels, transport and availability.
				
				When to ask for phone number:
				- For most serious trip enquiries (even simple ones), ask for the number early in the chat (within the first 1–2 replies) in a smooth, natural way.
				- Always ask when the trip is custom, multi-destination, luxury / honeymoon / bike, or not clearly a standard package.
				- Use this style in English: "The best planning for this trip happens on a quick call. Please share your phone number and our team member will call you personally."
				- After the user shares their number, continue answering normally in chat and keep helping them (do not stop the conversation).
				
				General role:
				- Help users plan their trips across India and suggest packages based on their preferences, budget, and dates.
				- Provide information about destinations, activities, and travel tips.
				- Answer questions about our packages and inclusions without over-sharing numbers.
				- Use words like budget / mid-range / premium instead of quoting exact rupee amounts unless explicitly required by the system.
				- Encourage users to share their contact details for personalized planning (phone or email).
				- When a user seems serious about planning or asks for a call, politely ask for their name and phone number and whether they prefer a call or WhatsApp.
				- When a user shares their phone number or email and trip details, clearly summarise their trip request in 3–5 short lines that a human planner can use to call them back.
				- After answering a couple of follow-up questions, gently move the conversation towards a call / WhatsApp / email by saying that a human expert can customise everything for them.
				- Towards the end of most replies, add one short line like: "You can also contact our team directly on +91 93175 01055 or email thehimexplorer55@gmail.com." (Always use exactly this phone number and email.)
					
				Available HimExplore packages (live from our system, up to 10 key options or generic examples):
				${packageContext}
					
				Top collections (most popular / best-selling themes):
				${topCollectionsContext}
					
				Offbeat & lesser-known collections (to unlock hidden gems across India):
				${offbeatCollectionsContext}
					
				Partner hotels & stay brands we work with:
				${partnerHotelsContext}
					
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

  // Build OpenAI-style messages for Groq
  const historyMessages = messages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));

  const payload = {
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 512,
    messages: [
      { role: "system", content: systemPrompt },
      ...historyMessages,
    ],
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[llm-ai] Groq API error",
        response.status,
        response.statusText,
        errorText,
      );

      if (response.status === 429) {
        return "Our AI assistant is receiving too many requests right now. Please try again in a bit, or share your trip details and we'll help you manually.";
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error("AI service authentication failed");
      }

      throw new Error("Failed to generate AI response");
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    const content: string | undefined =
      data.choices?.[0]?.message?.content ?? undefined;

    if (!content) {
      return "I'm sorry, I couldn't generate a response just now. Please try again.";
    }

    // Avoid repeating the welcome line on subsequent replies.
    const welcomeLine =
      "Welcome to HimExplore! I'm your Himachal trip planner buddy.";
    const hasUsedWelcomeBefore = messages.some(
      (msg) => msg.role === "assistant" && msg.content.includes(welcomeLine),
    );

    let finalContent = content;
    if (hasUsedWelcomeBefore) {
      finalContent = content
        .split("\n")
        .filter((line) => !line.trim().startsWith(welcomeLine))
        .join("\n")
        .trim();
    }

    return finalContent;
  } catch (error) {
    console.error("[llm-ai] Error generating response:", error);
    return "I'm having trouble connecting to the AI service right now. Please try again in a little while.";
  }
}

