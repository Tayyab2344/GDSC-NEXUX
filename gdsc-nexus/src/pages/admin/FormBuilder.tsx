import { API_BASE_URL } from '@/config/api';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Plus, FileText, Edit, Trash2, Copy, ExternalLink, GripVertical,
    Type, Mail, Phone, AlignLeft, Calendar, CheckSquare, List, Laptop, Palette, Target, Shield, Loader2, Save, Share2
} from "lucide-react";
import { toast } from "sonner";

interface FormField {
    id: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
}

interface FormSchema {
    fields: FormField[];
}

interface Form {
    id: string;
    title: string;
    slug: string;
    description: string;
    schema: FormSchema;
    isPublic: boolean;
    createdBy: string;
    createdAt: string;
    _count?: {
        submissions: number;
    };
}

const FormBuilder = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
    const [activeFormState, setActiveFormState] = useState<Partial<Form> | null>(null);

    const { data: user } = useQuery({
        queryKey: ["user", "profile"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/users/profile?includeFields=true`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.json();
        },
        enabled: !!token
    });

    const isMarketing = user?.fields?.some((f: any) => f.field.name === 'Marketing');

    const { data: forms, isLoading: isLoadingForms } = useQuery({
        queryKey: ["forms"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/forms`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch forms");
            return res.json() as Promise<Form[]>;
        },
        enabled: !!token
    });

    const { data: activeFormData, isLoading: isLoadingActive } = useQuery({
        queryKey: ["form", selectedFormId],
        queryFn: async () => {
            if (!selectedFormId) return null;
            const res = await fetch(`${API_BASE_URL}/forms/${selectedFormId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch form details");
            const data = await res.json();
            if (typeof data.schema === 'string') {
                try { data.schema = JSON.parse(data.schema); } catch (e) { data.schema = { fields: [] }; }
            }
            return data as Form;
        },
        enabled: !!selectedFormId
    });

    useEffect(() => {
        if (activeFormData) {
            setActiveFormState(JSON.parse(JSON.stringify(activeFormData)));
        }
    }, [activeFormData]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newFormTitle, setNewFormTitle] = useState("");
    const [newFormType, setNewFormType] = useState("GENERAL");

    const predefinedTemplates: Record<string, any> = {
        GENERAL: [
            { id: '1', label: "Full Name", type: "text", required: true },
            { id: '2', label: "Email Address", type: "email", required: true }
        ],
        MEMBERSHIP: [
            { id: '1', label: "Full Name", type: "text", required: true },
            { id: '2', label: "Registration Number", type: "text", required: true },
            { id: '3', label: "Email", type: "email", required: true },
            { id: '4', label: "Semester", type: "text", required: true },
            { id: '5', label: "Why do you want to join?", type: "textarea", required: true },
            { id: '6', label: "Technical Field", type: "technical-selection", required: true },
            { id: '7', label: "Non-Technical Field", type: "non-technical-selection", required: true }
        ],
        RECRUITMENT: [
            { id: '1', label: "Full Name", type: "text", required: true },
            { id: '2', label: "Email", type: "email", required: true },
            { id: '3', label: "Preferred Team", type: "unified-selection", required: true },
            { id: '4', label: "Leadership Experience", type: "textarea", required: true },
            { id: '5', label: "Upload CV", type: "file", required: true }
        ],
        EVENT_REGISTRATION: [
            { id: '1', label: "Full Name", type: "text", required: true },
            { id: '2', label: "Email", type: "email", required: true },
            { id: '3', label: "Registration Number", type: "text", required: true }
        ],
        FEEDBACK: [
            { id: '1', label: "Title", type: "text", required: false },
            { id: '2', label: "Feedback", type: "textarea", required: true },
            { id: '3', label: "Rating (1-5)", type: "text", required: true }
        ]
    };

    const createFormMutation = useMutation({
        mutationFn: async () => {
            const templateFields = (predefinedTemplates[newFormType] || []).map((f: any) => ({
                ...f,
                id: crypto.randomUUID()
            }));

            const newForm = {
                title: newFormTitle || "Untitled Form",
                description: `${newFormType.charAt(0) + newFormType.slice(1).toLowerCase().replace('_', ' ')} Form`,
                type: newFormType,
                schema: {
                    fields: templateFields
                },
                isPublic: false
            };
            const res = await fetch(`${API_BASE_URL}/forms`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(newForm)
            });
            if (!res.ok) throw new Error("Failed to create form");
            return res.json();
        },
        onSuccess: (newForm) => {
            queryClient.invalidateQueries({ queryKey: ["forms"] });
            toast.success("Form created!");
            setSelectedFormId(newForm.id);
            setIsCreateOpen(false);
            setNewFormTitle("");
            setNewFormType("GENERAL");
        },
        onError: () => toast.error("Failed to create form")
    });

    const updateFormMutation = useMutation({
        mutationFn: async (data: Partial<Form>) => {
            if (!selectedFormId) return;
            const payload = {
                title: data.title,
                description: data.description,
                schema: data.schema,
                isPublic: data.isPublic
            };

            const res = await fetch(`${API_BASE_URL}/forms/${selectedFormId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to update form");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forms"] });
            queryClient.invalidateQueries({ queryKey: ["form", selectedFormId] });
            toast.success("Form saved!");
        },
        onError: () => toast.error("Failed to save form")
    });

    const deleteFormMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE_URL}/forms/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete form");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forms"] });
            setSelectedFormId(null);
            setActiveFormState(null);
            toast.success("Form deleted");
        },
        onError: () => toast.error("Failed to delete form")
    });

    const handleAddField = (type: string, label: string) => {
        if (!activeFormState) return;
        const newField: FormField = {
            id: crypto.randomUUID(),
            label: label,
            type: type,
            required: false
        };
        setActiveFormState({
            ...activeFormState,
            schema: {
                ...activeFormState.schema!,
                fields: [...(activeFormState.schema?.fields || []), newField]
            }
        });
    };

    const handleRemoveField = (fieldId: string) => {
        if (!activeFormState) return;
        setActiveFormState({
            ...activeFormState,
            schema: {
                ...activeFormState.schema!,
                fields: activeFormState.schema?.fields.filter(f => f.id !== fieldId) || []
            }
        });
    };

    const handleCopyLink = (slug: string) => {
        const url = `${window.location.origin}/forms/${slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Form link copied!");
    };

    const fieldTypes = [
        { icon: Type, label: "Text", type: "text" },
        { icon: Mail, label: "Email", type: "email" },
        { icon: Phone, label: "Phone", type: "tel" },
        { icon: AlignLeft, label: "Textarea", type: "textarea" },
        { icon: Calendar, label: "Date", type: "date" },
        { icon: Laptop, label: "Technical Team", type: "technical-selection" },
        { icon: Palette, label: "Non-Technical Team", type: "non-technical-selection" },
        { icon: Target, label: "Any Team (Single)", type: "unified-selection" },
        { icon: Share2, label: "File Upload", type: "file" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto py-8 px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-display font-bold">Form Builder</h1>
                            <p className="text-muted-foreground">Create and manage custom forms</p>
                        </div>
                        {!isMarketing && (
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" /> Create Form
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New Form</DialogTitle>
                                        <DialogDescription>Choose a purpose to start with a template.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Form Title</Label>
                                            <Input
                                                placeholder="e.g. Fall Recruitment Drive"
                                                value={newFormTitle}
                                                onChange={(e) => setNewFormTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Form Purpose</Label>
                                            <Select value={newFormType} onValueChange={setNewFormType}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GENERAL">General Purpose</SelectItem>
                                                    <SelectItem value="MEMBERSHIP">Membership Application</SelectItem>
                                                    <SelectItem value="RECRUITMENT">Team Lead / Recruitment</SelectItem>
                                                    <SelectItem value="EVENT_REGISTRATION">Event Registration</SelectItem>
                                                    <SelectItem value="FEEDBACK">Feedback Survey</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                        <Button onClick={() => createFormMutation.mutate()} disabled={createFormMutation.isPending}>
                                            {createFormMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Form
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <h2 className="font-semibold text-lg mb-4">Your Forms</h2>
                            {isLoadingForms ? (
                                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                            ) : (
                                forms?.map(form => (
                                    <Card
                                        key={form.id}
                                        className={`cursor-pointer transition-all hover:border-google-blue ${selectedFormId === form.id ? 'border-google-blue ring-1 ring-google-blue' : ''}`}
                                        onClick={() => setSelectedFormId(form.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-google-blue" />
                                                    <span className="font-medium truncate max-w-[150px]">{form.title}</span>
                                                </div>
                                                <Badge variant={form.isPublic ? 'default' : 'secondary'}>
                                                    {form.isPublic ? 'Public' : 'Draft'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">{form._count?.submissions || 0} responses</p>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopyLink(form.slug);
                                                }}>
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(`/forms/${form.slug}`, '_blank');
                                                }}>
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                                {!isMarketing && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Form?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently remove the form "{form.title}" and all its submissions. This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deleteFormMutation.mutate(form.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            {activeFormState ? (
                                isLoadingActive ? <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div> :
                                    isMarketing ? (
                                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                                            <Shield className="h-12 w-12 mb-4 opacity-20" />
                                            <h3 className="text-lg font-semibold">View Only Mode</h3>
                                            <p>Marketing members can only view and copy form links.</p>
                                            <Button className="mt-4" onClick={() => handleCopyLink(activeFormState.slug || "")}>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy Link
                                            </Button>
                                        </div>
                                    ) : (
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle>Edit Form</CardTitle>
                                                        <CardDescription>Drag and drop fields to reorder</CardDescription>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                id="public"
                                                                checked={activeFormState.isPublic}
                                                                onCheckedChange={(checked) => setActiveFormState({ ...activeFormState, isPublic: checked })}
                                                            />
                                                            <Label htmlFor="public">Public</Label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="mb-6">
                                                    <Input
                                                        value={activeFormState.title}
                                                        onChange={(e) => setActiveFormState({ ...activeFormState, title: e.target.value })}
                                                        className="text-lg font-semibold mb-2"
                                                        placeholder="Form Title"
                                                    />
                                                    <Input
                                                        value={activeFormState.description || ""}
                                                        onChange={(e) => setActiveFormState({ ...activeFormState, description: e.target.value })}
                                                        placeholder="Form description"
                                                        className="text-muted-foreground"
                                                    />
                                                </div>

                                                <div className="mb-6">
                                                    <h4 className="text-sm font-medium text-foreground mb-3">Add Field</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {fieldTypes.map((field) => (
                                                            <Button
                                                                key={field.type}
                                                                variant="outline" size="sm" className="gap-2" onClick={() => handleAddField(field.type, field.label)}                               >                                 <field.icon className="w-4 h-4" />                                 {field.label}                               </Button>))}                           </div>                         </div>                          <div className="space-y-3">                           {(!activeFormState.schema?.fields || activeFormState.schema.fields.length === 0) && (<div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">                               No fields added yet. select a field type above.                             </div>)}                           {activeFormState.schema?.fields.map((field) => (<div key={field.id} className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 group"                             >                               <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />                               <div className="flex-1">                                 <div className="flex items-center gap-2">                                   <Input value={field.label} onChange={(e) => { const newFields = activeFormState.schema!.fields.map(f => f.id === field.id ? { ...f, label: e.target.value } : f); setActiveFormState({ ...activeFormState, schema: { ...activeFormState.schema!, fields: newFields } }); }} className="h-8 font-medium w-fit" />                                   <div className="flex items-center gap-2 ml-4">                                     <Switch checked={field.required} onCheckedChange={(checked) => { const newFields = activeFormState.schema!.fields.map(f => f.id === field.id ? { ...f, required: checked } : f); setActiveFormState({ ...activeFormState, schema: { ...activeFormState.schema!, fields: newFields } }); }} />                                     <Label className="text-xs">Required</Label>                                   </div>                                 </div>                                 <span className="text-xs text-muted-foreground capitalize ml-1">{field.type}</span>                               </div>                               <Button variant="ghost" size="icon" className="h-8 w-8 text-google-red" onClick={() => handleRemoveField(field.id)}                               >                                 <Trash2 className="w-4 h-4" />                               </Button>                             </div>))}                         </div>                          <div className="mt-6 flex gap-3">                           <Button variant="googleBlue" onClick={() => updateFormMutation.mutate(activeFormState)} disabled={updateFormMutation.isPending}                           >                             {updateFormMutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}                             Save Form                           </Button>                           <Button variant="outline" onClick={() => window.open(`/forms/${activeFormState.slug}`, '_blank')}>                             <ExternalLink className="w-4 h-4 mr-2" />                             Preview                           </Button>                         </div>                       </CardContent>                     </Card>)) : (<div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">                   <FileText className="h-12 w-12 mb-4 opacity-20" />                   <h3 className="text-lg font-semibold">Select a form to edit</h3>                   <p>Choose a form from the list or create a new one</p>                 </div>)}             </div>           </div>         </div>       </main>       <Footer />     </div>);
}; export default FormBuilder;
