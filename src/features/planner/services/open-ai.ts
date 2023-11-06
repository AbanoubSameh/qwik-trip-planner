import type { PlannerFormDefinition } from "~/features/planner/components/planner-form/form-definition";
import { server$ } from "@builder.io/qwik-city";

const OPEN_AI_BASE_URL = "https://api.openai.com/v1/";

export type AIPrompt = { role: string; content: string };

export const getOpenAIChatStream = server$(async function* (
  prompts: AIPrompt[]
) {
  const OPEN_AI_API_KEY: string = this.env.get("OPEN_AI_API_KEY") ?? "";

  const response = await initOpenAIChatRequest(OPEN_AI_API_KEY, prompts);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const reader = response.body?.getReader();

  let isStillStreaming = true;
  while (reader && isStillStreaming) {
    const { value, done } = await reader.read();
    yield mapOpenAIResponse(value);
    isStillStreaming = !done;
  }
});

export const buildGeneratePlanPrompt = (
  data: PlannerFormDefinition
): AIPrompt => {
  const htmlFormat = `<div class="travel-plan">
  <span class="day">{day}</span>
  <span class="time">{time}</span>
  <p class="description">{description}</p>
</div>`;

  const content = `Generate a travel plan to ${data.city} for ${data.duration} days. the response should be in HTML format ${htmlFormat} with no wrappers or any additional html tags or styles`;
  return { role: "user", content };
};

const initOpenAIChatRequest = async (
  oneAPIToken: string,
  prompts: AIPrompt[]
) => {
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: prompts,
    stream: true,
  });
  const response = fetch(`${OPEN_AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oneAPIToken}`,
    },
    body,
  });

  return response;
};

const mapOpenAIResponse = (openAIResponse: Uint8Array | undefined): string => {
  if (!openAIResponse) {
    return "";
  }

  const decoder = new TextDecoder();
  const stringValue = decoder.decode(openAIResponse);
  const stringDataBlocks = stringValue.split("data: ");

  let content = "";

  stringDataBlocks.forEach((stringDataBlock) => {
    const cleanedString = stringDataBlock
      .trim()
      .replace(/^data:\s*/, "")
      .replace(/[^ -~\t\r\n]/g, "");

    if (!cleanedString.includes("[DONE]")) {
      try {
        const obj = JSON.parse(cleanedString);
        const delta = obj.choices[0]?.delta?.content;
        if (typeof delta === "string" && delta) {
          content += delta;
        }
      } catch (error) {
        console.info(`unable to parse Open AI respones ${cleanedString}`);
      }
    }
  });

  return content;
};
