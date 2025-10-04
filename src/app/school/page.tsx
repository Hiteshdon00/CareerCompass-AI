'use client';

import React, { useState } from 'react';
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
import {
  suggestColleges,
  type CollegeSuggestionOutput,
} from '@/ai/flows/suggest-colleges';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  ChevronRight,
  Lightbulb,
  Loader2,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const quizQuestions = [
  {
    question: 'Which subject do you enjoy most in school?',
    options: [
      'Maths and Science',
      'Arts and Humanities',
      'Social Studies',
      'Languages',
    ],
  },
  {
    question: 'What kind of activity would you prefer for a school project?',
    options: [
      'Building a model or a robot',
      'Writing a story or a play',
      'Conducting a survey and analyzing results',
      'Organizing a school event',
    ],
  },
  {
    question: 'When you have free time, you prefer to:',
    options: [
      'Play video games or solve puzzles',
      'Draw, paint, or play music',
      'Read non-fiction books or watch documentaries',
      'Talk with friends and socialize',
    ],
  },
];

export default function SchoolPage() {
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState<'10_or_below' | '11_or_12' | null>(null);
  const [stream, setStream] = useState<'Science' | 'Commerce' | 'Arts' | null>(null);
  const [interests, setInterests] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For 10th graders
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [streamSuggestion, setStreamSuggestion] = useState<SkillAssessmentOutput | null>(null);

  // For 11th/12th graders
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeSuggestionOutput | null>(null);

  const handleGradeSelect = (selectedGrade: '10_or_below' | '11_or_12') => {
    setGrade(selectedGrade);
    setStep(1);
  };

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleStreamSuggest = async () => {
    setLoading(true);
    setError(null);
    try {
      const answersString = `My favorite subjects and activities are: ${Object.values(quizAnswers).join(', ')}. Based on this, suggest a suitable academic stream (Science, Commerce, or Arts) for my 11th and 12th grade in India.`;
      const result = await assessSkills({ userAnswers: answersString });
      setStreamSuggestion(result);
      setStep(2);
    } catch (e) {
      console.error(e);
      setError('Could not generate a stream suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeSuggest = async () => {
    if (!stream || !interests) return;
    setLoading(true);
    setError(null);
    try {
      const result = await suggestColleges({ stream, interests });
      setCollegeSuggestions(result);
      setStep(2);
    } catch (e) {
      console.error(e);
      setError('Could not generate college suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setGrade(null);
    setStream(null);
    setInterests('');
    setQuizAnswers({});
    setStreamSuggestion(null);
    setCollegeSuggestions(null);
    setLoading(false);
    setError(null);
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        {step > 0 && !loading && (
          <Button variant="ghost" onClick={reset} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
          </Button>
        )}

        {error && (
           <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
           </Alert>
        )}

        {step === 0 && <GradeSelector onSelect={handleGradeSelect} />}

        {loading && (
          <div className="flex flex-col items-center justify-center text-center p-8 h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI is thinking...
            </p>
          </div>
        )}

        {!loading && step === 1 && grade === '10_or_below' && (
          <StreamSuggestionQuiz
            answers={quizAnswers}
            onAnswer={handleQuizAnswer}
            onSubmit={handleStreamSuggest}
          />
        )}

        {!loading && step === 1 && grade === '11_or_12' && (
          <CollegeSuggestionForm
            stream={stream}
            setStream={setStream}
            interests={interests}
            setInterests={setInterests}
            onSubmit={handleCollegeSuggest}
          />
        )}

        {!loading && step === 2 && grade === '10_or_below' && streamSuggestion && (
          <StreamSuggestionResult result={streamSuggestion} onReset={reset} />
        )}

        {!loading && step === 2 && grade === '11_or_12' && collegeSuggestions && (
          <CollegeSuggestionResult result={collegeSuggestions} onReset={reset} />
        )}
      </div>
    </div>
  );
}

function GradeSelector({ onSelect }: { onSelect: (grade: '10_or_below' | '11_or_12') => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, Future Star!</CardTitle>
        <CardDescription>
          Let's figure out the next step in your academic journey. Which grade
          are you in?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          size="lg"
          className="w-full justify-between h-auto py-4"
          onClick={() => onSelect('10_or_below')}
        >
          <div className="text-left">
            <p className="font-bold text-lg">Class 10 or Below</p>
            <p className="font-normal text-sm text-primary-foreground/80">Find the perfect stream for you.</p>
          </div>
          <ChevronRight />
        </Button>
        <Button
          size="lg"
          className="w-full justify-between h-auto py-4"
          onClick={() => onSelect('11_or_12')}
        >
          <div className="text-left">
            <p className="font-bold text-lg">Class 11 or 12</p>
            <p className="font-normal text-sm text-primary-foreground/80">Discover your dream colleges.</p>
          </div>
          <ChevronRight />
        </Button>
      </CardContent>
    </Card>
  );
}

function StreamSuggestionQuiz({
  answers,
  onAnswer,
  onSubmit,
}: {
  answers: Record<number, string>;
  onAnswer: (questionIndex: number, answer: string) => void;
  onSubmit: () => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const isComplete = Object.keys(answers).length === quizQuestions.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stream Discovery Quiz</CardTitle>
        <CardDescription>
          Answer a few quick questions to find the best stream for you.
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
              onValueChange={(value) => onAnswer(currentQuestion, value)}
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
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {quizQuestions.length}
            </div>
            {currentQuestion < quizQuestions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={!answers[currentQuestion]}
              >
                Next
              </Button>
            ) : (
              <Button onClick={onSubmit} disabled={!isComplete}>
                Get Suggestion
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StreamSuggestionResult({ result, onReset }: { result: SkillAssessmentOutput; onReset: () => void }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Your Suggested Stream
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="text-left">
          <PartyPopper className="h-4 w-4" />
          <AlertTitle>We recommend:</AlertTitle>
          <AlertDescription>
            <p className="font-bold text-2xl text-primary">{result.suitableRole}</p>
          </AlertDescription>
        </Alert>
        <div className="text-left">
          <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Why it's a good fit:</h4>
          <p className="text-muted-foreground mt-2">{result.reasoning}</p>
        </div>
        <Button onClick={onReset} className="w-full">
          Start Over
        </Button>
      </CardContent>
    </Card>
  );
}

function CollegeSuggestionForm({
  stream,
  setStream,
  interests,
  setInterests,
  onSubmit,
}: {
  stream: string | null;
  setStream: (stream: 'Science' | 'Commerce' | 'Arts') => void;
  interests: string;
  setInterests: (interests: string) => void;
  onSubmit: () => void;
}) {
  const streams = ['Science', 'Commerce', 'Arts'];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Your Dream College</CardTitle>
        <CardDescription>
          Tell us your stream and interests, and we'll suggest some top colleges.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Your Current Stream</Label>
          <RadioGroup
            value={stream ?? ''}
            onValueChange={(value) => setStream(value as 'Science' | 'Commerce' | 'Arts')}
            className="flex space-x-4"
          >
            {streams.map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <RadioGroupItem value={s} id={s} />
                <Label htmlFor={s}>{s}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests">Your Interests</Label>
          <Input
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., Computer Science, Economics, Graphic Design"
          />
          <p className="text-xs text-muted-foreground">
            Separate your interests with commas.
          </p>
        </div>

        <Button onClick={onSubmit} disabled={!stream || !interests} className="w-full">
          Suggest Colleges
        </Button>
      </CardContent>
    </Card>
  );
}

function CollegeSuggestionResult({ result, onReset }: { result: CollegeSuggestionOutput; onReset: () => void; }) {
  return (
     <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
           <Sparkles className="h-6 w-6 text-primary" /> Your College Recommendations
        </CardTitle>
        <CardDescription>Here are some colleges that could be a great fit for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         {result.colleges.map((college, index) => (
            <Card key={index} className="bg-secondary/50">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="h-5 w-5" />
                    {college.name}
                  </CardTitle>
                  <CardDescription>{college.location}</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-sm"><BookOpen className="h-4 w-4" />Suggested Courses:</h4>
                    <p className="text-muted-foreground text-sm mt-1">{college.suggestedCourses}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold flex items-center gap-2 text-sm"><Lightbulb className="h-4 w-4" />Why it's a great choice:</h4>
                    <p className="text-muted-foreground text-sm mt-1">{college.reason}</p>
                  </div>
               </CardContent>
            </Card>
         ))}
        <Button onClick={onReset} className="w-full" variant="outline">
          Start Over
        </Button>
      </CardContent>
    </Card>
  )
}
