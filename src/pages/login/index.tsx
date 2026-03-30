import { useLogin } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { GraduationCap, Loader2 } from "lucide-react";

const LoginPage = () => {
    const { mutate: login, isPending: isLoading } = useLogin();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        login(values);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="mx-auto w-full max-w-md shadow-lg border-none bg-background/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <GraduationCap className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-muted-foreground text-base">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-base">Email address</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="name@university.edu" 
                                                {...field} 
                                                className="h-12 bg-muted/50 focus:bg-background transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-base">Password</FormLabel>
                                            <Link 
                                                to="/forgot-password" 
                                                className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                placeholder="••••••••" 
                                                {...field} 
                                                className="h-12 bg-muted/50 focus:bg-background transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-8 text-center text-sm border-t pt-6">
                        <p className="text-muted-foreground">
                            Don't have an account?{" "}
                            <Link 
                                to="/register" 
                                className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
