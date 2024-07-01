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

  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<string>('1024x1024');
  const [imageModel, setImageModel] = useState<string>('dall-e-2');
  const [quality, setImageQuality] = useState<string>('standard');
  const [style, setImageStyle] = useState<string>('vivid');
  const numberOfImages: number = 1;
  
  const imageSizesDALLE2 = [
    { value: '256x256' },
    { value: '512x512' },
    { value: '1024x1024' },
  ]

  const imageSizesDALLE3 = [
    { value: '1024x1024' },
    { value: '1024x1792' },
    { value: '1792x1024' },
  ]

  const imageModels = [
    { emoji: 'DALL-E 2', value: 'dall-e-2' },
    { emoji: 'DALL-E 3', value: 'dall-e-3' },
  ]

  const imageQuality = [
    { emoji: '🤖', value: 'standard' },
    { emoji: '🧔🏻‍♂️👩🏻', value: 'hd' },
  ]

  const imageStyle = [
    { emoji: '🎨', value: 'vivid' },
    { emoji: '👁️', value: 'natural' },
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
      setIsLoading(false)
    }
  }

  const handleGenerateImage = async (): Promise<void> => {
    setImageIsLoading(true);
    const response = await fetch("api/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages[messages.length - 1].content,
        imageSize: imageSize,
        imageModel: imageModel,
        quality: quality,
        style: style,
        numberOfImages: numberOfImages,
      }),
    });
    const data = await response.json();
    setImage(data);
    setImageIsLoading(false);
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
          <form className="space-y-4">
          {messages.length < 2 && (
            <div>
              <p className="text-gray-500 text-center mb-3 text-lg md:text-base">
                Select a theme for the painting to create a description with
              </p>
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
                  className="w-full p-2 my-2 border border-gray-300 rounded shadow-xl text-black"
                  // disabled={isLoading}
                  value={description}
                  placeholder="Describe the painting..."
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
                  onClick={handleGenerateDescription}>
                  Generate Description
                </button>
              </div>
            </div>
            )}
            <div>
            {messages.length === 2 &&  (
              <div>
                <div>
                  <div className="space-y-4 my-2 bg-opacity-25 bg-blue-700 rounded-lg p-4">
                      <h3 className="text-xl font-semibold">Image Generation Properties</h3>
                      <div className="flex flex-wrap justify-left bg-gray-700 rounded-lg p-2">
                        <h5 className="text-l font-semibold">Model</h5>
                        {imageModels.map(({ value, emoji }) => (
                          <div
                            key={value}
                            className="p-4 m-2 bg-opacity-25 bg-gray-300 rounded-lg text-sm">
                            <input
                              id={value}
                              type="radio"
                              name="model"
                              value={value}
                              checked={value === imageModel}
                              onChange={(e) => {
                                setImageModel(e.target.value);
                                setImageSize('1024x1024');
                                setImageQuality('standard');
                                setImageStyle('vivid');
                              }}
                            />
                            <label className="ml-2" htmlFor={value}>
                              {`${emoji}`}
                            </label>
                          </div>
                        ))}
                      </div>
                      {imageModel === 'dall-e-2' && (
                        <div className='bg-gray-600 rounded-lg p-2'>
                          <div className="flex flex-wrap justify-left">
                            <h5 className="text-l font-semibold">Size</h5>
                            {imageSizesDALLE2.map(({ value }) => (
                              <div
                                key={value}
                                className="w-full md:w-max p-5 m-2 bg-opacity-25 bg-gray-300 rounded-lg text-sm">
                                <input
                                  id={value}
                                  type="radio"
                                  name="size"
                                  value={value}
                                  checked={value === imageSize}
                                  onChange={(e) => setImageSize(e.target.value)}
                                />
                                <label className="ml-2" htmlFor={value}>
                                  {value}
                                </label>
                              </div>
                            ))}
                          </div>
                      </div>
                    )}
                    {imageModel === 'dall-e-3' && (
                      <div className='bg-gray-600 rounded-lg p-2'>
                        <div className="flex flex-wrap justify-left bg-gray-500 rounded-md p-2 mx-1 mb-2">
                          <h5 className="text-l font-semibold">Size</h5>
                          {imageSizesDALLE3.map(({ value }) => (
                            <div
                              key={value}
                              className="w-full md:w-max p-4 m-2 bg-opacity-25 bg-gray-300 rounded-lg text-sm">
                              <input
                                id={value}
                                type="radio"
                                name="size"
                                value={value}
                                checked={value === imageSize}
                                onChange={(e) => setImageSize(e.target.value)}
                              />
                              <label className="ml-2" htmlFor={value}>
                                {value}
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap justify-left bg-gray-500 rounded-md p-2 mx-1 mb-2">
                          <h5 className="text-l font-semibold">Quality</h5>
                          {imageQuality.map(({ value, emoji }) => (
                            <div
                              key={value}
                              className="w-full md:w-max p-4 m-2 bg-opacity-25 bg-gray-300 rounded-lg text-sm">
                              <input
                                id={value}
                                type="radio"
                                name="quality"
                                value={value}
                                checked={value === quality}
                                onChange={(e) => setImageQuality(e.target.value)}
                              />
                              <label className="ml-2" htmlFor={value}>
                                {`${emoji} ${value}`}
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap justify-left bg-gray-500 rounded-md p-2 mx-1 mt-1">
                          <h5 className="text-l font-semibold">Style</h5>
                          {imageStyle.map(({ value, emoji }) => (
                            <div
                              key={value}
                              className="w-full md:w-max p-4 m-2 bg-opacity-25 bg-gray-300 rounded-lg text-sm">
                              <input
                                id={value}
                                type="radio"
                                name="style"
                                value={value}
                                checked={value === style}
                                onChange={(e) => setImageStyle(e.target.value)}
                              />
                              <label className="ml-2" htmlFor={value}>
                                {`${emoji} ${value}`}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="w-full bg-green-500 text-white mt-1 py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-gray-300 mb-5"
                    disabled={isLoading}
                    onClick={handleGenerateImage}>
                    Generate Image
                  </button>
                </div>
              </div>
              )}
            </div>
          </form>
        </div>
        <div
          className="md:basis-3/5 basis-full md:overflow-auto"
          ref={messagesContainerRef}>
          { !imageIsLoading && !image ? (
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
                      style={{ minHeight: '350px' }} // Ensure a minimum height and prevent resizing
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
          ) : !image ? (
            <div className="flex justify-center items-center h-screen">
              <div className="loader">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card w-full h-screen max-w py-2 mx-auto stretch">
              <img src={`data:image/jpeg;base64,${image}`} />
              <textarea
                className="mt-4 w-full text-white bg-black h-64"
                value={messages[messages.length - 1].content}
                readOnly
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
