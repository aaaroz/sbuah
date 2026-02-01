"use client";

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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/schemas/category/category-schema";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useCategories } from "./categories-provider";
import { toast } from "sonner";

type CategoriesMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function CategoriesMutateDialog({
  open,
  onOpenChange,
}: CategoriesMutateDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const {
    currentCategory: category,
    createCategoryMutation: createCategory,
    updateCategoryMutation: updateCategory,
  } = useCategories();
  const isUpdate = !!category;
  const schema = isUpdate ? updateCategorySchema : createCategorySchema;
  const content = {
    title: isUpdate ? "Ubah Kategori" : "Tambah Kategori",
    description: isUpdate
      ? "Ubah nama kategori. Klik simpan untuk menyimpan perubahan."
      : "Tambah jenis kategori baru. Klik tambah untuk menyimpan kategori baru.",
  };

  type TypeValues = z.infer<typeof schema>;

  const form = useForm<TypeValues>({
    resolver: zodResolver(schema),
    defaultValues: category ?? {
      name: "",
    },
  });

  async function onSubmit(values: TypeValues) {
    try {
      if (createCategory.isPending || updateCategory.isPending) return;

      const payload = {
        id: isUpdate ? category?.id : undefined,
        name: values.name ?? "",
      };

      const mutate = !isUpdate
        ? createCategory.mutateAsync(payload)
        : updateCategory.mutateAsync(payload);

      toast.promise(mutate, {
        loading: !isUpdate
          ? "Menambahkan kategori..."
          : "Menyimpan kategori...",
        success: (data: { name: string }) =>
          `Kategori "${data.name}" berhasil disimpan.`,
        error: "Gagal menyimpan kategori.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan kategori");
    } finally {
      form.reset();
      onOpenChange(false);
    }
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
          <CategoryMutateForm
            form={form}
            onSubmit={onSubmit}
            isUpdate={isUpdate}
          />
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
        <CategoryMutateForm
          form={form}
          onSubmit={onSubmit}
          isUpdate={isUpdate}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type MutateValues =
  | {
      name: string;
    }
  | {
      id?: string;
      name?: string;
    };

type CategoryMutateFormProps = {
  isUpdate: boolean;
  onSubmit: (values: MutateValues) => Promise<void>;
  form: UseFormReturn<
    z.core.output<
      | z.ZodObject<
          {
            name: z.ZodString;
          },
          z.core.$strip
        >
      | z.ZodObject<
          {
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
          },
          z.core.$strip
        >
    >,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    z.core.output<
      | z.ZodObject<
          {
            name: z.ZodString;
          },
          z.core.$strip
        >
      | z.ZodObject<
          {
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
          },
          z.core.$strip
        >
    >
  >;
};
function CategoryMutateForm({
  onSubmit,
  form,
  isUpdate,
}: CategoryMutateFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-6")}
      >
        <Field className="grid gap-3">
          <FieldLabel>Nama Kategori</FieldLabel>
          <Input placeholder="Minuman" {...form.register("name")} />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isUpdate ? "Simpan" : "Tambah"}
        </Button>
      </form>
    </Form>
  );
}
