import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

interface FormSchema {
  fields: FormField[];
}

interface Form {
  id: string;
  title: string;
  description: string;
  slug: string;
  schema: FormSchema;
}

const PublicForm = () => {
  const { slug } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const { data: form, isLoading, error } = useQuery({
    queryKey: ["form", slug],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/forms/slug/${slug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Form not found");
        throw new Error("Failed to fetch form");
      }
      return res.json() as Promise<Form>;
    },
    enabled: !!slug
  });

  const { data: fields } = useQuery({
    queryKey: ["fields"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/fields");
      if (!res.ok) throw new Error("Failed to fetch fields");
      return res.json();
    }
  });

  const technicalFields = fields?.filter((f: any) => f.category === 'TECHNICAL') || [];
  const nonTechnicalFields = fields?.filter((f: any) => f.category === 'NON_TECHNICAL') || [];


  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`http://localhost:3000/forms/${form?.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      });
      if (!res.ok) throw new Error("Submission failed");
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Form submitted successfully!");
    },
    onError: (err) => {
      toast.error("Failed to submit form. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Transform formValues (UUID -> Value) into structured data for backend
    const submissionData: any = {};
    const techFields: string[] = [];
    const nonTechFields: string[] = [];

    // Map through schema fields to reconstruct object
    form.schema.fields.forEach((field: any) => {
      const value = formValues[field.id];
      if (!value) return;

      if (field.type === "technical-selection") {
        techFields.push(value);
      } else if (field.type === "non-technical-selection") {
        nonTechFields.push(value);
      } else if (field.type === "unified-selection") {
        // Determine category dynamically if possible, or just push to preferred
        // For unified, we might check if value exists in tech or non-tech lists
        const isTech = technicalFields.some((f: any) => f.name === value);
        if (isTech) techFields.push(value);
        else nonTechFields.push(value);
      } else if (field.label.toLowerCase().includes("name")) {
        submissionData.fullName = value;
      } else if (field.label.toLowerCase().includes("email")) {
        submissionData.email = value;
      } else if (field.label.toLowerCase().includes("phone")) {
        submissionData.phone = value;
      } else if (field.label.toLowerCase().includes("registration")) {
        submissionData.regNo = value;
      } else if (field.label.toLowerCase().includes("why")) {
        submissionData.whyJoin = value;
      } else {
        // Fallback for other custom fields
        submissionData[field.label] = value;
      }
    });

    if (techFields.length > 0) submissionData.technicalFields = techFields;
    if (nonTechFields.length > 0) submissionData.nonTechnicalFields = nonTechFields;

    // Spread original key-values too just in case
    const finalData = { ...formValues, ...submissionData };
    submitMutation.mutate(finalData);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex justify-center">
          <p>Loading form...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <AlertCircle className="w-12 h-12 text-google-red mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground">The form you are looking for does not exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center">
              <CardContent className="pt-12 pb-8">
                <div className="w-20 h-20 rounded-full bg-google-green/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-google-green" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Submission Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your submission. We'll review your application and get back to you soon.
                </p>
                <Button variant="googleBlue" onClick={() => {
                  setSubmitted(false);
                  setFormValues({});
                }}>
                  Submit Another Response
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{form.title}</CardTitle>
              <CardDescription>{form.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {form.schema.fields.map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-google-red ml-1">*</span>}
                    </Label>
                    {field.type === "technical-selection" ? (
                      <RadioGroup
                        onValueChange={(value) => handleInputChange(field.id, value)}
                        value={formValues[field.id] || ''}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {technicalFields.map((f: any) => (
                            <div key={f.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50">
                              <RadioGroupItem value={f.name} id={`r-${field.id}-${f.id}`} />
                              <Label htmlFor={`r-${field.id}-${f.id}`} className="cursor-pointer font-normal w-full">{f.name}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : field.type === "non-technical-selection" ? (
                      <RadioGroup
                        onValueChange={(value) => handleInputChange(field.id, value)}
                        value={formValues[field.id] || ''}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {nonTechnicalFields.map((f: any) => (
                            <div key={f.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50">
                              <RadioGroupItem value={f.name} id={`r-${field.id}-${f.id}`} />
                              <Label htmlFor={`r-${field.id}-${f.id}`} className="cursor-pointer font-normal w-full">{f.name}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : field.type === "unified-selection" ? (
                      <RadioGroup
                        onValueChange={(value) => handleInputChange(field.id, value)}
                        value={formValues[field.id] || ''}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[...technicalFields, ...nonTechnicalFields].map((f: any) => (
                            <div key={f.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50">
                              <RadioGroupItem value={f.name} id={`r-unified-${field.id}-${f.id}`} />
                              <Label htmlFor={`r-unified-${field.id}-${f.id}`} className="cursor-pointer font-normal w-full">{f.name} <span className="text-xs text-muted-foreground ml-2">({f.category === 'TECHNICAL' ? 'Tech' : 'Non-Tech'})</span></Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                        className="min-h-[100px]"
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    )}

                    {field.type === "file" && (
                      <div className="flex items-center gap-2">
                        <Input
                          id={field.id}
                          type="file"
                          required={field.required}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append('file', file);

                            const toastId = toast.loading("Uploading file...");
                            try {
                              const res = await fetch('http://localhost:3000/forms/upload', {
                                method: 'POST',
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Optional if public, but usually safer. If public form, maybe endpoint should be public.
                                body: formData
                              });
                              if (!res.ok) throw new Error('Upload failed');
                              const data = await res.json();
                              handleInputChange(field.id, data.url);
                              toast.success("File uploaded!");
                            } catch (err) {
                              toast.error("Upload failed");
                            } finally {
                              toast.dismiss(toastId);
                            }
                          }}
                        />
                        {formValues[field.id] && <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />}
                      </div>
                    )}

                  </div>
                ))}
                <Button type="submit" variant="googleBlue" className="w-full gap-2" disabled={submitMutation.isPending}>
                  <Send className="w-4 h-4" />
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicForm;
