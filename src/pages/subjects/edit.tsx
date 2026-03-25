import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { subjectSchema } from "@/lib/schema";
import { Department } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import { useWatch } from "react-hook-form";
import * as z from "zod";

const EditSubject = () => {
    const form = useForm({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
        },
        refineCoreProps: {
            resource: "subjects",
            action: "edit",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const { query: departmentsQuery } = useList<Department>({
        resource: "departments",
        pagination: { pageSize: 100 },
    });

    const departments = departmentsQuery.data?.data || [];
    const departmentsLoading = departmentsQuery.isLoading;

    // Watch form field values — populated when useForm calls reset() with the fetched record
    const watchedDepartmentId = useWatch({ control, name: "departmentId" });

    const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error updating subject:", error);
        }
    };

    return (
        <EditView className="class-view">
            <EditViewHeader resource="subjects" title="Edit Subject" />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Edit Subject Details
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Subject Name */}
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Subject Name <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Introduction to Biology - Section A"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Department */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="departmentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Department <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    key={`department-${watchedDepartmentId}`}
                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                    defaultValue={watchedDepartmentId?.toString()}
                                                    disabled={departmentsLoading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a department" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departments.map((department) => (
                                                            <SelectItem
                                                                key={department.id}
                                                                value={department.id.toString()}
                                                            >
                                                                {department.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Capacity & Status */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Subject Code <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="CI101"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Description */}
                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief description about the class"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting || departmentsLoading}>
                                    {isSubmitting ? (
                                        <div className="flex gap-1 items-center">
                                            <span>Saving Changes...</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </EditView>
    );
};

export default EditSubject;