import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, imageSize, imageModel, quality, style, numberOfImages } = await req.json();
  const prompt = `Generate an image that describes the following recipe: ${message}`;
  const response = await openai.images.generate({
    model: imageModel,
    prompt: prompt.substring(0, Math.min(prompt.length, 1000)),
    size: imageSize,
    quality: quality,
    style: style,
    response_format: "b64_json",
    n: numberOfImages,
  });
  let responses: string[] = [];
  for (let i = 0; i < numberOfImages; i++) {
    responses.push(JSON.stringify(response.data[i].b64_json));
  }
  return new Response(responses[0])
}
