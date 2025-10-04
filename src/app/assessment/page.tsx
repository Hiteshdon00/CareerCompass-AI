'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  assessSkills,
  type SkillAssessmentOutput,
} from '@/ai/flows/assess-skills';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const quizzes = {
  school: [
    {
      question: 'Which subject do you enjoy most in school?',
      options: ['Maths and Science', 'Arts and Humanities', 'Social Studies', 'Languages'],
    },
    {
      question: 'What kind of activity would you prefer for a school project?',
      options: ['Building a model or a robot', 'Writing a story or a play', 'Conducting a survey and analyzing results', 'Organizing a school event'],
    },
    {
      question: 'When you have free time, you prefer to:',
      options: ['Play video games or solve puzzles', 'Draw, paint, or play music', 'Read non-fiction books or watch documentaries', 'Talk with friends and socialize'],
    },
    {
      question: 'What sounds like a fun future job?',
      options: ['Inventing something new', 'Designing a cool product', 'Becoming a leader in a field', 'Helping people in your community'],
    },
    {
      question: 'How do you like to learn new things?',
      options: ['By experimenting and doing', 'By watching and observing', 'By reading and researching', 'By listening and discussing'],
    },
  ],
  college: [
    {
      question: 'Which of these activities do you enjoy the most?',
      options: [
        'Solving complex logical puzzles',
        'Creating a visually appealing design',
        'Organizing a detailed project plan',
        'Helping others and communicating ideas',
      ],
    },
    {
      question: 'How do you prefer to work?',
      options: [
        'Independently, focusing on a single task',
        'Collaboratively in a team',
        'In a leadership role, guiding others',
        'In a structured environment with clear guidelines',
      ],
    },
    {
      question: 'What are you most interested in learning?',
      options: [
        'The latest programming languages and technologies',
        'Principles of art and design',
        'Business management and strategy',
        'Psychology and human behavior',
      ],
    },
    {
      question: 'What kind of impact do you want to make in your career?',
      options: [
        'Build innovative products that change the world',
        'Create beautiful and meaningful experiences',
        'Lead successful teams and companies',
        'Make a positive difference in people\'s lives',
      ],
    },
    {
      question: 'When faced with a difficult problem, what is your first instinct?',
      options: [
        'Break it down into smaller, logical steps',
        'Brainstorm creative and unconventional solutions',
        'Consult with others to get different perspectives',
        'Research best practices and established methods',
      ],
    },
  ],
  professional: [
    {
      question: 'What aspect of your current or previous job did you find most rewarding?',
      options: ['Achieving a challenging technical goal', 'Mentoring junior team members', 'Improving a process to make it more efficient', 'Closing a major deal or partnership'],
    },
    {
      question: 'What is your primary motivation for a career change or advancement?',
      options: ['Higher salary and better benefits', 'More meaningful and impactful work', 'Better work-life balance', 'Leadership and management opportunities'],
    },
    {
      question: 'How do you approach learning new skills for your career?',
      options: ['Through structured online courses and certifications', 'By working on side projects', 'Through on-the-job training and mentorship', 'By attending conferences and networking'],
    },
    {
      question: 'What kind of work environment do you thrive in?',
      options: ['A fast-paced, innovative startup', 'A large, stable corporation with clear structures', 'A collaborative, mission-driven non-profit', 'A flexible remote-first company'],
    },
    {
      question: 'Looking five years ahead, what do you want to have accomplished?',
      options: ['Become a recognized expert in my field', 'Lead a high-performing team', 'Start my own business', 'Transitioned to a completely new industry'],
    },
  ]
};

function AssessmentFlow() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'college';
  const quizQuestions = quizzes[role as keyof typeof quizzes] || quizzes.college;

  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] =
    useState<SkillAssessmentOutput | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAssessmentResult(null);
    try {
      const answersString = Object.values(answers).join('. ');
      const result = await assessSkills({ userAnswers: answersString });
      setAssessmentResult(result);
    } catch (error) {
      console.error('Error assessing skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const isQuizComplete = Object.keys(answers).length === quizQuestions.length;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        {!assessmentResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Skill Assessment Quiz</CardTitle>
              <CardDescription>
                Answer these questions to help us understand your interests and
                personality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">
                    {currentQuestion + 1}. {quizQuestions[currentQuestion].question}
                  </h3>
                  <RadioGroup
                    value={answers[currentQuestion]}
                    onValueChange={(value) =>
                      handleAnswerChange(currentQuestion, value)
                    }
                    className="mt-4 space-y-2"
                  >
                    {quizQuestions[currentQuestion].options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="flex justify-between">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  {currentQuestion < quizQuestions.length - 1 ? (
                    <Button onClick={handleNext} disabled={!answers[currentQuestion]}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isQuizComplete || loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
              <CardDescription>
                Based on your answers, here are some roles you might be suitable for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Your Suggested Role</AlertTitle>
                <AlertDescription>
                  <p className="font-bold text-lg text-primary">{assessmentResult.suitableRole}</p>
                </AlertDescription>
              </Alert>
              <div className="mt-6">
                <h4 className="font-semibold">Reasoning:</h4>
                <p className="text-muted-foreground mt-2">{assessmentResult.reasoning}</p>
              </div>
              <Button onClick={() => setAssessmentResult(null)} className="mt-6 w-full">
                Take Quiz Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


export default function AssessmentPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AssessmentFlow />
    </React.Suspense>
  )
}
