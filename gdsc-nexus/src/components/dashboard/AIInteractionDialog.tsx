import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Brain, Loader2, Copy, Sparkles, Wand2, FileSearch } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type AITask = 'summarize' | 'refine' | 'quiz' | 'resume';

interface AIInteractionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: AITask;
}

export function AIInteractionDialog({ open, onOpenChange, task }: AIInteractionDialogProps) {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    const aiMutation = useMutation({
        mutationFn: async (text: string) => {
            const endpoint = task === 'refine' ? '/ai/refine-announcement' :
                task === 'resume' ? '/ai/resume-feedback' :
                    task === 'summarize' ? '/ai/summarize-submissions' : '/ai/generate-quiz';

            const payload = task === 'refine' ? { content: text } :
                task === 'resume' ? { resume: text, field: 'General' } :
                    task === 'summarize' ? { submissions: [text] } : { topic: text };

            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('AI request failed');
            return res.json();
        },
        onSuccess: (data) => {
            setResult(data.refined || data.feedback || data.summary || JSON.stringify(data.questions, null, 2));
            toast.success("AI Generation complete!");
        },
        onError: () => {
            toast.error("AI processing failed. Check your API configuration.");
        }
    });

    const getTaskDetails = () => {
        switch (task) {
            case 'refine': return { title: 'AI Announcement Refiner', icon: Wand2, label: 'Draft Content', placeholder: 'Paste your announcement draft here...' };
            case 'summarize': return { title: 'AI Recruitment Summarizer', icon: Sparkles, label: 'Applicant Data', placeholder: 'Paste applicant details or trends...' };
            case 'quiz': return { title: 'AI Quiz Generator', icon: Brain, label: 'Topic', placeholder: 'E.g. React.js Hooks, Python Basics...' };
            case 'resume': return { title: 'AI Resume Feedback', icon: FileSearch, label: 'Resume Text', placeholder: 'Paste the resume content here...' };
        }
    };

    const config = getTaskDetails();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <config.icon className="h-5 w-5 text-google-blue" />
                        {config.title}
                    </DialogTitle>
                    <DialogDescription>
                        Powered by Google Gemini 1.5 Flash. Generates professional insights instantly.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="ai-input">{config.label}</Label>
                        <Textarea
                            id="ai-input"
                            placeholder={config.placeholder}
                            className="h-[120px] resize-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    {result && (
                        <div className="grid gap-2">
                            <Label className="flex items-center justify-between">
                                AI Output
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(result);
                                        toast.info("Copied to clipboard");
                                    }}
                                >
                                    <Copy className="h-4 w-4 mr-1" />
                                    Copy
                                </Button>
                            </Label>
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-slate-50 dark:bg-slate-900 border-google-blue/20">
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{result}</p>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="google"
                        className="w-full"
                        disabled={aiMutation.isPending || !input}
                        onClick={() => aiMutation.mutate(input)}
                    >
                        {aiMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing with Gemini...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Professional Output
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
