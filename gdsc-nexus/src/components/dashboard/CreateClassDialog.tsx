import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CreateClassDialogProps {
    fieldId: string;
}

const CreateClassDialog = ({ fieldId }: CreateClassDialogProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("60");
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time) {
            toast.error("Please select date and time");
            return;
        }

        const scheduledAt = new Date(date);
        const [hours, minutes] = time.split(':');
        scheduledAt.setHours(parseInt(hours), parseInt(minutes));

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/classes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    scheduledAt: scheduledAt.toISOString(),
                    durationMin: parseInt(duration),
                    fieldId
                })
            });

            if (!res.ok) throw new Error("Failed to create class");

            toast.success("Class created successfully");
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["classes", fieldId] });

            // Reset form
            setTitle("");
            setDescription("");
            setDate(undefined);
            setTime("");
        } catch (error) {
            toast.error("Failed to create class");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Class</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                    <DialogDescription>
                        Schedule a new live session. A meeting link will be generated automatically.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (min)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Create Class</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateClassDialog;
