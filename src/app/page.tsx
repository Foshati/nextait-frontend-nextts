"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface QuestionResponse {
  answer: string;
}

export default function QuestionAnswerComponent() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAnswer('')

    try {
      const response = await fetch('http://localhost:8000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data: QuestionResponse = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      console.error('Error:', error)
      setAnswer('Failed to get an answer. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>AI Question Answering</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Get Answer'
            )}
          </Button>
        </form>
        {answer && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p>{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}