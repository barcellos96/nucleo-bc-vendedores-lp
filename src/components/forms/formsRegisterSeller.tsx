"use client";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useRef, useState } from "react";
import { formatPhone } from "@/hooks/phone";
import { formatCPF } from "@/hooks/cpf";
import { formatCNPJ } from "@/hooks/cnpj";
import { SellerContext } from "@/providers/sellers";
import { ComponentsContext } from "@/providers/components";

type OptionType = "CNPJ" | "CPF";

export default function FormsRegisterSeller() {
  const { setShowModalTy } = useContext(ComponentsContext);
  const { CreateSeller } = useContext(SellerContext);

  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionType>("CNPJ");

  const handleCheckboxChange = () => {
    setSelectedOption(selectedOption === "CNPJ" ? "CPF" : "CNPJ");
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setCode(searchParams.get("code")); // Now, this will not throw a TypeScript error
  }, []);

  const schema = z
    .object({
      username: z.string().min(1, "Preencha seu nome"),
      email: z
        .string()
        .email({ message: "E-mail enviado é inválido" })
        .min(1, "Preencha seu email"),
      document_type: z.enum(["CNPJ", "CPF"]).default(selectedOption),
      document_number: z.string().min(1, "Preencha seu documento"),
      company_name: z.string().optional(),
      phone: z.string().min(1, "Preencha seu whatsapp"),
      password: z.string().min(1, "Coloque uma senha para você"),
    })
    .superRefine((data, ctx) => {
      if (
        data.document_type === "CNPJ" &&
        data.document_number
          .replace(/\D/g, "") // Remove todos os caracteres que não são dígitos
          .slice(0, 14).length !== 14
      ) {
        ctx.addIssue({
          code: "custom", // Adiciona o código de erro
          path: ["document_number"],
          message: "CNPJ deve ter 14 dígitos",
        });
      } else if (
        data.document_type === "CPF" &&
        data.document_number
          .replace(/\D/g, "") // Remove todos os caracteres que não são dígitos
          .slice(0, 11).length !== 11
      ) {
        ctx.addIssue({
          code: "custom", // Adiciona o código de erro
          path: ["document_number"],
          message: "CPF deve ter 11 dígitos",
        });
      }

      if (
        data.phone
          .replace(/\D/g, "") // Remove todos os caracteres que não são dígitos
          .slice(0, 11).length < 10
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "O número de telefone deve ter pelo menos 10 dígitos",
        });
      }
    });

  type RegisterProps = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterProps>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterProps> = async (value) => {
    setLoading(true);

    await CreateSeller(value, code ? code : "100").finally(() => {
      setShowModalTy(true);
    });
    setLoading(false);
    formRef.current?.reset();
  };

  return (
    <div className="text-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <input
          placeholder="Insira seu nome"
          type="text"
          className="w-full py-2 px-3 text-xl rounded-md border border-blue-800 outline-none"
          {...register("username")}
        />
        {errors.username && (
          <p className="flex text-sm text-red-500">{errors.username.message}</p>
        )}
        <input
          placeholder="Insira seu melhor e-mail"
          type="text"
          className="w-full py-2 px-3 text-xl rounded-md border border-blue-800 outline-none"
          {...register("email")}
        />
        {errors.email && (
          <p className="flex text-sm text-red-500">{errors.email.message}</p>
        )}

        <input
          placeholder="Cadastre uma senha"
          type="password"
          className="w-full py-2 px-3 text-xl rounded-md border border-blue-800 outline-none"
          {...register("password")}
        />
        {errors.password && (
          <p className="flex text-sm text-red-500">{errors.password.message}</p>
        )}

        <div className="flex flex-col py-2 text-lg gap-2 font-light">
          <section className="flex">
            <span className="font-semibold">Como podemos identificá-lo:</span>
          </section>

          <section>
            <section className="flex gap-2">
              <input
                type="checkbox"
                checked={selectedOption === "CNPJ"}
                className="outline-none"
                onChange={handleCheckboxChange}
              />
              <label>Pessoa Jurídica</label>
            </section>

            <section className="flex gap-2">
              <input
                type="checkbox"
                className="outline-none"
                checked={selectedOption === "CPF"}
                onChange={handleCheckboxChange}
              />
              <label>Pessoa Física</label>
            </section>
          </section>
        </div>

        <div
          className="relative transition-opacity duration-500 overflow-hidden"
          style={{ maxHeight: "300px" }} // Limita a altura para simular que há mais conteúdo
        >
          <div className="space-y-2">
            {selectedOption === "CNPJ" && (
              <input
                placeholder="Nome da empresa"
                type="text"
                disabled={!selectedOption}
                className="w-full py-2 px-3 text-xl rounded-md border border-blue-800 outline-none"
                {...register("company_name")}
              />
            )}

            <input
              placeholder={`${selectedOption === "CNPJ" ? "CNPJ" : "CPF"}`}
              type="text"
              disabled={!selectedOption}
              className="w-full py-2 px-3 text-xl rounded-md border border-blue-800 outline-none"
              {...register("document_number")}
              onChange={(e) => {
                const inputValue = e.target.value;
                selectedOption === "CNPJ"
                  ? setValue("document_number", formatCNPJ(inputValue))
                  : setValue("document_number", formatCPF(inputValue));
              }}
            />
            {errors.document_number && (
              <p className="flex text-sm text-red-500">
                {errors.document_number.message}
              </p>
            )}
            <input
              placeholder="Whatsapp"
              disabled={!selectedOption}
              type="tel"
              className="w-full py-2 px-3 text-xl rounded-md border border-blue-800 outline-none"
              {...register("phone")}
              onChange={(e) => {
                const inputValue = e.target.value;
                setValue("phone", formatPhone(inputValue));
              }}
            />
          </div>
          {errors.phone && (
            <p className="flex text-sm text-red-500">{errors.phone.message}</p>
          )}

          <button
            type="submit"
            disabled={!selectedOption || isSubmitting}
            className="text-white font-bold w-full mt-4 rounded-lg text-lg py-2"
            style={{ backgroundColor: "#194C8D" }}
          >
            {loading ? "carregando..." : "INSCREVA-SE AGORA"}
          </button>
        </div>
      </form>

      <section className="mt-1">
        <span className="font-extralight text-sm leading-tight">
          De acordo com a lei 12.965/2014 e 13.709/2018, autorizo enviarem
          comunicações por e-mail ou qualquer outro meio e concordo com a sua
          política de privacidade.
        </span>
      </section>
    </div>
  );
}
