import OpenAI from 'openai'
import { StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI()
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = await openai.beta.threads.createAndRun({
    assistant_id: process.env.ASSISTANT_ID || '',
    stream: true,
    thread: { messages },
  })

  // Start an encoded stream
  const encoder = new TextEncoder()
  const streamResponse = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        // Check only for events of type `delta` and extract the content text
        if (
          event.event === 'thread.message.delta' &&
          !!event.data.delta.content &&
          event.data.delta.content[0].type === 'text'
        ) {
          const textChunk = event.data.delta.content[0].text?.value
          controller.enqueue(encoder.encode(textChunk))
        }
      }
      controller.close()
    },
  })

  return new StreamingTextResponse(streamResponse)
}

export async function GET() {
  const response = (await openai.beta.assistants.retrieve(
    process.env.ASSISTANT_ID || ''
  )) || { name: 'AI' }

  return new Response(JSON.stringify({ name: response.name }))
}
