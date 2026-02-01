"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/schemas/product/product-schema";
import { api, getUploadthingKey } from "@/lib/utils";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";
import {
  CloudUploadIcon,
  SaveAllIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { MenuCard } from "@/components/commons/menu-card";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/hooks/use-uploadthing";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUploadThingFile } from "@/lib/utils/delete-ut-file";
import { useProducts } from "./products-provider";

type ProductsFormProps = {
  mode: "create" | "edit";
  initialData?: z.infer<typeof updateProductSchema> & { id: string };
};

export function ProductsForm({ mode, initialData }: ProductsFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const hasInitialized = useRef(false);

  const schema = mode === "create" ? createProductSchema : updateProductSchema;

  type FormValues = z.infer<typeof schema>;

  const { startUpload, isUploading } = useUploadThing("productImage");

  const {
    createProductMutation: createProduct,
    updateProductMutation: updateProduct,
  } = useProducts();

  const { data: categories, isLoading } = api.category.getAll.useQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "edit" && initialData
        ? {
            ...initialData,
          }
        : {
            name: "",
            description: null,
            price: 0,
            imageUrl: null,
            categoryId: null,
            status: "ACTIVE",
          },
  });

  const dropzone = useDropzone<string>({
    onDropFile: async (file: File) => {
      setImageFile(file);

      const previewImageUrl = URL.createObjectURL(file);

      form.setValue("imageUrl", previewImageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      return {
        status: "success",
        result: previewImageUrl,
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true, // replaces old image automatically
  });

  const previewName =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    form.watch("name")?.trim() || initialData?.name || "Sop Buah Special";

  const previewDescription =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    form.watch("description")?.trim() ||
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    initialData?.description ||
    "Deskripsi produk akan tampil di sini.";

  const previewPrice =
    form.watch("price") && (form.watch("price") ?? 0) > 0
      ? form.watch("price")
      : (initialData?.price ?? 0);

  const previewImage =
    dropzone.fileStatuses.at(-1)?.result ??
    "https://placehold.co/600x400?text=Preview";

  async function onSubmit(values: FormValues) {
    try {
      if (createProduct.isPending || updateProduct.isPending) return;
      console.log({ values });

      const previousImageUrl = values.imageUrl ?? null;
      let imageUrl = previousImageUrl;

      if (imageFile) {
        const uploadPromise = startUpload([imageFile]);

        toast.promise(uploadPromise, {
          loading: "Mengunggah gambar...",
          success: "Berhasil mengunggah gambar.",
          error: "Gagal mengunggah gambar.",
        });

        const data = await uploadPromise;

        if (!data?.[0]?.ufsUrl) {
          throw new Error("Gagal mengunggah gambar.");
        }

        imageUrl = data[0].ufsUrl;
      }

      const shouldDeleteOldImage =
        imageFile && previousImageUrl && previousImageUrl !== imageUrl;

      if (shouldDeleteOldImage) {
        const key = getUploadthingKey(previousImageUrl);
        if (key) deleteUploadThingFile(key).catch(console.error);
      }

      const payload = {
        ...values,
        imageUrl,
      };

      const mutate =
        mode === "create"
          ? createProduct.mutateAsync({
              name: payload.name ?? "",
              description: payload.description ?? "",
              price: payload.price ?? 0,
              imageUrl,
              categoryId: payload.categoryId ?? null,
              status: payload.status,
            })
          : updateProduct.mutateAsync({
              id: initialData?.id ?? "",
              name: payload.name ?? "",
              description: payload.description ?? "",
              price: payload.price ?? 0,
              imageUrl,
              categoryId: payload.categoryId ?? null,
              status: payload.status,
            });

      toast.promise(mutate, {
        loading:
          mode === "create" ? "Menambahkan produk..." : "Menyimpan produk...",
        success: (data: { name: string }) =>
          `Produk "${data.name}" berhasil disimpan.`,
        error: "Gagal menyimpan produk.",
      });

      router.push("/dashboard/products");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan produk");
    } finally {
      setImageFile(null);
    }
  }

  useEffect(() => {
    if (hasInitialized.current) return;
    if (mode !== "edit" || !initialData?.imageUrl) return;

    hasInitialized.current = true;

    dropzone.setFiles([
      {
        id: "initial-image",
        file: new File([], "existing-image"),
        fileName: "Gambar Produk saat ini",
        status: "success",
        result: initialData.imageUrl,
        tries: 1,
      },
    ]);
  }, [mode, initialData?.imageUrl, dropzone]);

  useEffect(() => {
    if (mode !== "edit" || !initialData) return;

    form.reset({
      name: initialData.name,
      description: initialData.description,
      price: initialData.price,
      imageUrl: initialData.imageUrl,
      categoryId: initialData.categoryId,
      status: initialData.status,
    });
  }, [mode, initialData, form]);

  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full grid-cols-2 gap-6"
        >
          {/* Name */}
          <Field>
            <FieldLabel>Nama Produk</FieldLabel>
            <Input placeholder="Sop buah special" {...form.register("name")} />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>

          {/* Price */}
          <Field>
            <FieldLabel>Harga</FieldLabel>
            <Input
              type="number"
              {...form.register("price", {
                valueAsNumber: true,
              })}
            />
            <FieldError>{form.formState.errors.price?.message}</FieldError>
          </Field>

          {/* Category */}
          <Field>
            <FieldLabel>Kategori</FieldLabel>
            <Select
              disabled={isLoading}
              value={form.watch("categoryId") ?? ""}
              onValueChange={(value) => form.setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>Opsional, tetapi disarankan.</FieldDescription>
            <FieldError>{form.formState.errors.categoryId?.message}</FieldError>
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>Deskripsi</FieldLabel>
            <Textarea
              placeholder="Deskripsikan produk secara singkat"
              {...form.register("description")}
            />
            <FieldError>
              {form.formState.errors.description?.message}
            </FieldError>
          </Field>

          {/* Image URL */}
          <Field className="col-span-2">
            <FieldLabel>Gambar Produk</FieldLabel>
            <div className="not-prose flex flex-col gap-4">
              <Dropzone {...dropzone}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <DropzoneDescription>
                      Unggah 1 gambar produk (PNG / JPG, maksimal 10MB)
                    </DropzoneDescription>
                    <DropzoneMessage />
                  </div>

                  <DropZoneArea>
                    <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
                      <CloudUploadIcon className="size-8" />
                      <div>
                        <p className="font-semibold">Unggah gambar produk</p>
                        <p className="text-muted-foreground">
                          Klik atau tarik & lepas di sini
                        </p>
                      </div>
                    </DropzoneTrigger>
                  </DropZoneArea>
                </div>

                <DropzoneFileList className="grid grid-cols-1 gap-3 p-0">
                  {dropzone.fileStatuses.map((file, i) => {
                    if (i !== dropzone.fileStatuses.length - 1) return null;

                    return (
                      <DropzoneFileListItem
                        key={file.id}
                        file={file}
                        className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                      >
                        {file.status === "pending" && (
                          <div className="aspect-video animate-pulse bg-black/20" />
                        )}

                        {file.status === "success" && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={file.result}
                            alt={file.fileName}
                            className="aspect-video object-cover"
                          />
                        )}

                        <div className="flex items-center justify-between p-2 pl-4">
                          <p className="truncate text-sm">{file.fileName}</p>

                          <DropzoneRemoveFile
                            variant="ghost"
                            className="shrink-0"
                          >
                            <Trash2Icon className="size-4" />
                          </DropzoneRemoveFile>
                        </div>
                      </DropzoneFileListItem>
                    );
                  })}
                </DropzoneFileList>
              </Dropzone>
            </div>

            <FieldError>{form.formState.errors.imageUrl?.message}</FieldError>
          </Field>
        </form>
      </Form>
      <div className="flex flex-col gap-6">
        <div className="flex h-fit flex-col gap-4 rounded-md border p-4">
          <div className="px-3">
            <Label className="text-lg font-bold">Pratinjau</Label>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-0 sm:grid-cols-2 md:p-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <MenuCard
                key={index}
                id={"preview"}
                imageUrl={previewImage}
                name={previewName}
                description={previewDescription}
                price={previewPrice ?? 9999}
                rating={5.0}
                reviews={1234}
                isPreview
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {mode === "create" && (
            <Button
              onClick={async () => {
                form.setValue("status", "DRAFT");
                await form.handleSubmit(onSubmit)();
              }}
              disabled={
                createProduct.isPending ||
                updateProduct.isPending ||
                isLoading ||
                isUploading
              }
              variant="secondary"
              className="w-full"
            >
              <SaveIcon />
              <span>Simpan Sebagai Draft</span>
            </Button>
          )}
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={
              createProduct.isPending ||
              updateProduct.isPending ||
              isLoading ||
              isUploading
            }
            className="w-full"
          >
            <SaveAllIcon />
            <span>Simpan {mode === "create" ? "Produk" : "Perubahan"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
