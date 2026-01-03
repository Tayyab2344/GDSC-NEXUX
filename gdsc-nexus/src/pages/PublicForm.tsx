import { API_BASE_URL } from '@/config/api';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Send, ArrowLeft, ShieldCheck, Mail, User, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { usePageTitle } from "@/hooks/use-page-title";

interface FormField {
    id: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
}

interface Form {
    id: string;
    title: string;
    slug: string;
    description: string;
    schema: { fields: FormField[] };
    isPublic: boolean;
}

const PublicForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [files, setFiles] = useState<Record<string, File>>({});

    const { data: form, isLoading, error } = useQuery({
        queryKey: ["form", "public", slug],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/forms/public/${slug}`);
            if (!res.ok) {
                if (res.status === 404) throw new Error("Form not found");
                throw new Error("Failed to load form");
            }
            return res.json() as Promise<Form>;
        },
        retry: false
    });

    usePageTitle(form?.title || "Form");

    const submitMutation = useMutation({
        mutationFn: async () => {
            const body = new FormData();
            body.append('data', JSON.stringify(formData));

            Object.entries(files).forEach(([fieldId, file]) => {
                body.append(`file_${fieldId}`, file);
            });

            const res = await fetch(`${API_BASE_URL}/forms/${form?.id}/submit`, {
                method: "POST",
                body: body
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to submit form");
            }
            return res.json();
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        submitMutation.mutate(undefined, {
            onSuccess: () => {
                setSubmitted(true);
                toast.success("Form submitted successfully!");
            },
            onError: (err: any) => {
                toast.error(err.message);
            }
        });
    };

    const handleInputChange = (fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleFileChange = (fieldId: string, file: File | null) => {
        if (file) {
            setFiles(prev => ({ ...prev, [fieldId]: file }));
            setFormData(prev => ({ ...prev, [fieldId]: file.name }));
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading form...</div>;

    if (error || !form) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Oops!</CardTitle>
                        <CardDescription>{error instanceof Error ? error.message : "This form is no longer available."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="google" onClick={() => navigate('/')}>Return Home</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col pt-24">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center p-8">
                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 bg-google-green/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-google-green" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-display font-bold mb-2">Submission Received</h2>
                        <p className="text-muted-foreground mb-8">
                            Thank you for your interest! Your application for {form.title} has been received.
                            Our team will review it and get back to you soon.
                        </p>
                        <Button variant="google" className="w-full" onClick={() => navigate('/')}>
                            Back to Homepage
                        </Button>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="container max-w-2xl mx-auto">
                    <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <Card className="border-2">
                        <CardHeader className="text-center pb-8 border-b">
                            <div className="mx-auto w-12 h-12 bg-google-blue/10 rounded-xl flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-google-blue" />
                            </div>
                            <CardTitle className="text-3xl font-display font-bold">{form.title}</CardTitle>
                            <CardDescription className="text-lg mt-2">{form.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {form.schema.fields.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <Label className="text-base">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </Label>

                                        {field.type === 'textarea' ? (
                                            <Textarea
                                                required={field.required}
                                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                value={formData[field.id] || ""}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                className="min-h-[120px] resize-none"
                                            />
                                        ) : field.type === 'file' ? (
                                            <div className="space-y-2">
                                                <Input
                                                    type="file"
                                                    required={field.required}
                                                    onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
                                                    className="cursor-pointer"
                                                />
                                                <p className="text-xs text-muted-foreground">Max file size: 5MB (PDF/DOCX/JPG)</p>
                                            </div>
                                        ) : (
                                            <Input
                                                type={field.type}
                                                required={field.required}
                                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                value={formData[field.id] || ""}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                className="h-11"
                                            />
                                        )}
                                    </div>
                                ))}

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        variant="google"
                                        className="w-full h-12 text-lg shadow-lg hover:shadow-google-blue/20"
                                        disabled={submitMutation.isPending}
                                    >
                                        {submitMutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Submit Application
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Your data is stored securely by GDSC Nexus
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PublicForm;
