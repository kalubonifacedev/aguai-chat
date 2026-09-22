import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type LanguageModel,
} from "ai";
import { createGoogle } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import fs from "fs";
import path from "path";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const GEMINI_KEY =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.1-70b-versatile";
const PRIMARY = process.env.AI_PROVIDER ?? "gemini";

type Provider = {
  name: string;
  model: LanguageModel;
  options?: Record<string, Record<string, string>>;
};

const MAX_OUTPUT_TOKENS = 700;
const MAX_CHAT_MESSAGES = 5;

const BUSY_MESSAGES = [
  "Nnoo, many people are asking me about Ututu right now, and I need a moment to gather my thoughts. Please ask me again shortly.",
  "The elders are speaking all at once tonight! Give me a little time to listen properly, then ask me again.",
  "So many voices are calling on Agu at once. Rest a moment and ask me again shortly, I do not want to rush your story.",
  "I want to give your question the attention it deserves, but too many people are with me right now. Please try again in a moment.",
];

function pickBusyMessage(): string {
  return BUSY_MESSAGES[Math.floor(Math.random() * BUSY_MESSAGES.length)];
}

function busyResponse() {
  const message = pickBusyMessage();
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "text-start", id: "busy" });
      writer.write({ type: "text-delta", id: "busy", delta: message });
      writer.write({ type: "text-end", id: "busy" });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

function getProviders(): Provider[] {
  const list: Provider[] = [];

  if (GEMINI_KEY) {
    const google = createGoogle({ apiKey: GEMINI_KEY });
    list.push({ name: "gemini", model: google(GEMINI_MODEL) });
  }

  if (GROQ_KEY) {
    const groq = createGroq({ apiKey: GROQ_KEY });
    list.push({
      name: "groq",
      model: groq(GROQ_MODEL),
      options: { groq: { reasoningEffort: "low" } },
    });
  }

  return list.sort((a, b) =>
    a.name === PRIMARY ? -1 : b.name === PRIMARY ? 1 : 0,
  );
}

const FILES = [
  "ututu-history.md",
  "ututu-government-and-religion.md",
  "ututu-villages-and-zones.md",
  "agu-ai-developer.md",
];

const FOLDERS = [
  path.join(process.cwd(), "content"),
  path.join(process.cwd(), "app", "content"),
];

function loadHistory(): string {
  return FILES.map((file) => {
    for (const folder of FOLDERS) {
      const filePath = path.join(folder, file);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf8");
      }
    }
    return "";
  })
    .filter(Boolean)
    .join("\n\n---\n\n");
}

function buildSystemPrompt(
  history: string,
  userProfile?: { name?: string; village?: string; gender?: string },
): string {
  let userInfoText = "You are currently speaking with an anonymous guest.";

  if (userProfile?.name) {
    const honorific =
      userProfile.gender?.toLowerCase() === "female"
        ? "Great daughter of Ututu"
        : "Great son of Ututu";

    userInfoText = `You are speaking directly with ${userProfile.name}${
      userProfile.village ? ` from ${userProfile.village} village` : ""
    }.
Address them warmly by their name (${userProfile.name}) and honorifically as "${honorific}".
Whenever they ask who they are or what their name is, explicitly confirm their identity using these profile details.`;
  }

  return `You are Agu, the wise, warm, and venerable digital storyteller of the historic Ututu Kingdom (Arochukwu LGA, Abia State).

CURRENT USER CONTEXT:
${userInfoText}

YOUR PERSONALITY, TONE & GREETINGS:
- Speak like an elder holding court under the village tree: warm, respectful, engaging, and deeply thoughtful.
- Greet users according to the time of day:
  * In the morning, greet them with: "Nnawo"
  * In the afternoon or night, greet them with: "Ndewo"
- When asking how someone is doing, say: "Ndali-imere?"
- Always incorporate their personal information (${userProfile?.name ?? "Guest"}) into the conversation when available.
- Frequently weave in the proverb: "The answer you seek lies in the heart of Agu, as passed down by our founders."

RESPONSE & BOUNDARY RULES:
1. Ground all historical, cultural, and lineage facts STRICTLY in the APPROVED HISTORY provided below.
2. If a specific detail is not found in the approved history, respond gracefully with warmth: explain that this specific account is not yet recorded in the archives, and warmly encourage them to share what they know using the "Add history" button so the elders can review it.
3. If asked about non-Ututu topics, politely guide them back: "Ah, that lies outside the lands of Ututu. I am here to share the stories, lineage, and history of our people—ask me about our villages, customs, or heritage."
4. Never sound like a database or a compliance machine. Tell the history like a living story.

APPROVED HISTORY:
${history}`;
}

export async function POST(req: Request) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const body = await req.json();
    const { messages } = body;
    let userProfile = body.userProfile;

    // Fallback: Check cookies if client body didn't contain userProfile
    if (!userProfile && supabaseUrl && supabaseAnonKey) {
      const cookieStore = await cookies();
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // Safe to ignore in route handlers
            }
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userProfile = {
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0],
          village: user.user_metadata?.village,
          gender: user.user_metadata?.gender,
        };
      }
    }

    console.log("Resolved User Profile for Agu:", userProfile);

    const system = buildSystemPrompt(loadHistory(), userProfile);
    const modelMessages = await convertToModelMessages(
      messages.slice(-MAX_CHAT_MESSAGES),
    );

    const providers = getProviders();
    if (providers.length === 0) {
      return busyResponse();
    }

    for (const provider of providers) {
      try {
        const result = streamText({
          model: provider.model,
          system,
          messages: modelMessages,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          providerOptions: provider.options,
          maxRetries: 0,
        });

        // Force the provider call to happen now so auth / rate-limit / model
        // errors surface here instead of later inside the stream.
        // This prevents the UI from freezing on a 200 stream that later fails.
        await result.text;

        // Provider is healthy → stream the response to the client
        return result.toUIMessageStreamResponse();
      } catch (providerError) {
        console.error(`Provider ${provider.name} failed:`, providerError);
        // Try the next provider
      }
    }

    // All providers failed
    return busyResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return busyResponse();
  }
}
