import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/types/types";

type AddProductModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreateProduct: (values: z.infer<typeof formSchema>) => void;
};

const formSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.coerce.number().min(0.05),
  category: z.nativeEnum(Category),
});

const AddProductModal = ({
  open,
  setOpen,
  onCreateProduct,
}: AddProductModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: undefined,
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Aggiungi un prodotto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aggiungi un prodotto</DialogTitle>
          <DialogDescription>
            Inserisci nome, prezzo e categoria ed aggiungi un nuovo prodotto al
            tuo menu
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreateProduct)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold leading-none tracking-tight">
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input className="text-md" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold leading-none tracking-tight">
                    Prezzo
                  </FormLabel>
                  <FormControl>
                    <Input
                      step="0.01"
                      type="number"
                      className="text-md"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold leading-none tracking-tight">
                    Categoria
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona una categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ANTIPASTO">Antipasto</SelectItem>
                      <SelectItem value="PRIMO">Primo</SelectItem>
                      <SelectItem value="SECONDO">Secondo</SelectItem>
                      <SelectItem value="DOLCE">Dolce</SelectItem>
                      <SelectItem value="BEVANDA">Bevanda</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Aggiungi
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
