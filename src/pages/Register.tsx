import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import {
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(3).max(50),
  surname: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(7).max(50),
});

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { email, password, name, surname } = values;
    registerWithEmailAndPassword(email, password, name, surname)
      .then(() => {
        navigate("/");
        toast({
          title: "Registrazione effettuata",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Ooops! Qualcosa è andato storto",
          description: "Prova ad effettuare nuovamente la registrazione",
        })
      );
  };

  const onGoogleSignIn = () => {
    signInWithGoogle()
      .then(() => {
        navigate("/");
        toast({
          title: "Registrazione effettuata",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Ooops! Qualcosa è andato storto",
          description: "Prova ad effettuare nuovamente la registrazione",
        })
      );
  };

  return (
    <div className="container-custom w-full flex items-center justify-center mt-10">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-10 w-full max-w-[556px]">
        <div className="space-y-4 pb-6">
          <h1 className="text-3xl font-bold text-center">
            Crea il tuo account
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Nome</FormLabel>
                  <FormControl>
                    <Input className="text-md" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Cognome</FormLabel>
                  <FormControl>
                    <Input className="text-md" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              Registrati
            </Button>
          </form>
          <Separator className="my-4" />
          <div className="w-full flex flex-col space-y-4">
            <Button
              onClick={onGoogleSignIn}
              variant="outline"
              className="text-lg"
            >
              <FcGoogle className="mr-2 h-5 w-5" /> Registrati con Google
            </Button>

            <p className="text-center">
              Hai già un account?{" "}
              <Link to="/login" className="font-bold">
                Accedi
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
