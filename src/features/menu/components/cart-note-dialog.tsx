import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/lib/stores/cart-store";

const schema = z.object({
  note: z.string().optional(),
});

type TypeValues = z.infer<typeof schema>;
type CartNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
};

export function CartNoteDialog({
  open,
  onOpenChange,
  productId,
  productName,
}: CartNoteDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const updateNote = useCartStore.getState().updateNote;
  const items = useCartStore((s) => s.items);
  const existingNote = items.find((i) => i.id === productId)?.note;

  const content = {
    title: `${existingNote ? "Ubah" : "Tambah"} Pesan`,
    description: "Kalau ada pesan tambahan, jangan sungkan yaa..",
  };

  const form = useForm<TypeValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      note: existingNote ?? "",
    },
  });

  async function onSubmit(values: TypeValues) {
    const note = values.note?.trim();

    if (!note) {
      toast.error("Pesan tidak boleh kosong");
      return;
    }

    const addNotePromise = Promise.resolve().then(() => {
      updateNote(productId, note);
    });

    toast.promise(addNotePromise, {
      loading: `Menambahkan pesan untuk "${productName}"`,
      success: `Pesan untuk "${productName}" berhasil ditambahkan.`,
      error: "Gagal menambahkan pesan.",
    });

    await addNotePromise.then(() => {
      form.reset();
      onOpenChange(false);
    });
  }

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          form.reset();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>

          <NoteForm form={form} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        form.reset();
      }}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{content.title}</DrawerTitle>
          <DrawerDescription>{content.description}</DrawerDescription>
        </DrawerHeader>
        <NoteForm form={form} onSubmit={onSubmit} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type NoteFormProps = {
  onSubmit: (values: TypeValues) => Promise<void>;
  form: UseFormReturn<TypeValues>;
};
function NoteForm({ onSubmit, form }: NoteFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-6")}
      >
        <Field className="grid gap-3">
          <FieldLabel>Nama Kategori</FieldLabel>
          <Textarea
            placeholder="Es nya sedikit aja.."
            {...form.register("note")}
          />
          <FieldError>{form.formState.errors.note?.message}</FieldError>
        </Field>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Tambahkan
        </Button>
      </form>
    </Form>
  );
}
