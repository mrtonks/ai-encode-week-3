'use client'

import { useState, useRef, useEffect } from 'react'

interface IMessage {
  role: string
  content: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [theme, setTheme] = useState<string>('Nature and Landscapes')
  const [description, setDescription] = useState<string>('')
  const [messages, setMessages] = useState<Array<IMessage>>([])
  const [assistantName, setAssistantName] = useState<string>('')

  const themes = [
    { emoji: '🌲', value: 'Nature and Landscapes' },
    { emoji: '🏙️', value: 'Urban and Cityscapes' },
    { emoji: '👤', value: 'Portraits and People' },
    { emoji: '🐅', value: 'Animals and Wildlife' },
    { emoji: '🌸', value: 'Floral and Botanical' },
    { emoji: '🍎', value: 'Still Life' },
    { emoji: '🐉', value: 'Fantasy and Mythology' },
    { emoji: '🎨', value: 'Abstract and Conceptual' },
    { emoji: '🏺', value: 'Historical and Cultural' },
    { emoji: '🕊️', value: 'Religious and Spiritual' },
    { emoji: '📢', value: 'Social and Political' },
    { emoji: '🚀', value: 'Fantasy and Science Fiction' },
    { emoji: '🌊', value: 'Seascapes and Marine' },
    { emoji: '🏡', value: 'Everyday Life' },
    { emoji: '🏅', value: 'Sports and Recreation' },
  ]

  const handleGenerateDescription = async (): Promise<void> => {
    setMessages([])
    setIsLoading(true)

    // Push the user message to the messages state to show it in the screen
    const userMessage = {
      role: 'user',
      content: `Generate a painting description using the theme ${theme}. The painting description should match the following short description and improved: ${description}.`,
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setDescription('')
    setTheme('Nature and Landscapes')

    const response = await fetch('api/assistants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [userMessage],
      }),
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    // Push the initial system message to the messages state
    const systemMessage = { role: 'system', content: '' }
    setMessages((prevMessages) => [...prevMessages, systemMessage])

    // While we receive a result, decode the stream
    if (reader) {
      let result
      let accumulatedContent = ''
      while (!(result = await reader.read()).done) {
        const chunk = decoder.decode(result.value, { stream: true })
        accumulatedContent += chunk
        // Update the content of the last message (system message) with the new chunk
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages]
          const lastMessage = updatedMessages[updatedMessages.length - 1]
          lastMessage.content = accumulatedContent
          return updatedMessages
        })
      }
    }

    setIsLoading(false)
  }

  const handleGenerateImage = () : void => {
    // TODO: Write endpoint and generate image
    console.log(messages[messages.length - 1].content)
  }

  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAssistantName = async () => {
      const response = await fetch('api/assistants', { method: 'GET' })
      const data = await response.json()
      setAssistantName(data.name)
    }

    fetchAssistantName()
  }, [])

  useEffect(() => {
    setMessages(messages)

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <main className="container mx-auto h-screen">
      <div className="text-center mb-6 mt-2">
        <h1 className="text-3xl font-bold">Paintings Description Assistant</h1>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-4 place-content-center mx-3">
        <div className="md:basis-2/5 basis-full flex flex-col">
          <p className="text-gray-500 text-center mb-3 text-lg md:text-base">
            Select a theme for the painting to create a description with
          </p>
          <form className="space-y-4">
            <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Themes</h3>

              <div className="flex flex-wrap justify-center">
                {themes.map(({ value, emoji }) => (
                  <div
                    key={value}
                    className="w-full md:w-max p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg text-sm">
                    <input
                      id={value}
                      type="radio"
                      name="topic"
                      value={value}
                      checked={value === theme}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                    <label className="ml-2" htmlFor={value}>
                      {`${emoji} ${value}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <input
                className="w-full p-2 mb-2 border border-gray-300 rounded shadow-xl text-black"
                // disabled={isLoading}
                value={description}
                placeholder="Describe the painting..."
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <button
                type="button"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
                onClick={handleGenerateDescription}>
                Generate Description
              </button>
              {messages.length === 2 && (
                <button
                  type="button"
                  className="w-full bg-green-500 text-white mt-1 py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-gray-300 mb-5"
                  onClick={handleGenerateImage}>
                  Generate Image
                </button>
              )}
            </div>
          </form>
        </div>
        <div
          className="md:basis-3/5 basis-full md:overflow-auto"
          ref={messagesContainerRef}>
          <div className="flex flex-col w-full h-full max-w pb-24 mx-auto stretch">
            {!!assistantName && (
              <div className="whitespace-pre-wrap bg-slate-700 p-3 my-2 rounded-lg text-white">
                <b>{assistantName}: </b>What kind of painting are you going ask
                me to describe for you today?
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-2 ${message.role === 'system' && 'flex-grow'}`}>
                {message.role === 'user' ? (
                  <div className="whitespace-pre-wrap bg-green-700 p-3 rounded-lg text-white">
                    <b>User: </b>
                    {message.content}
                  </div>
                ) : (
                  <textarea
                    className="whitespace-pre-wrap bg-slate-700 p-3 rounded-lg text-white w-full h-full"
                    style={{ minHeight: '100px' }} // Ensure a minimum height and prevent resizing
                    value={message.content}
                    readOnly
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end pr-4">
                <span className="animate-bounce">...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
