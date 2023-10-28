import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7).max(50),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className="container-custom w-full flex items-center justify-center mt-10">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-10 w-full max-w-[556px]">
        <div className="space-y-4 pb-6">
          <h1 className="text-3xl font-bold text-center">Accedi</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Email</FormLabel>
                  <FormControl>
                    <Input className="text-md" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Password</FormLabel>
                  <FormControl>
                    <Input className="text-md" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full text-lg" type="submit">
              Accedi
            </Button>
          </form>
          <Separator className="my-4" />
          <div className="w-full flex flex-col space-y-4">
            <Button variant="outline" className="text-lg">
              <Mail className="mr-2 h-5 w-5" /> Accedi con Gmail
            </Button>
            <Button variant="outline" className="text-lg">
              <Facebook className="mr-2 h-5 w-5" /> Accedi con Facebook
            </Button>
            <p className="text-center">
              Non hai un account?{" "}
              <Link to="/register" className="font-bold">
                Registrati
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
