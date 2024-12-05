"use client";

import { api } from "@/service/api";
import { createContext, ReactNode } from "react";
import { toast } from "sonner";

interface CreateUserProps {
  username: string;
  email: string;
  password: string;
  document_type: "CNPJ" | "CPF";
  document_number: string;
  company_name?: string;
  phone: string;
}

interface Response extends CreateUserProps {
  code: string;
  registeredBy: {
    id: string;
    username: string;
    email: string;
    document_number: string;
    code: string;
  };
  comission_limit: number;
  created_at: Date;
  id: string;
  isActive: boolean;
  approved: boolean;
}

interface ISellerData {
  CreateSeller(data: CreateUserProps, code: string): Promise<Response>;
}

interface ICihldrenReact {
  children: ReactNode;
}

export const SellerContext = createContext<ISellerData>({} as ISellerData);

export const SellerProvider = ({ children }: ICihldrenReact) => {
  const CreateSeller = async (
    data: CreateUserProps,
    code: string
  ): Promise<Response> => {
    const config = {
      params: { code },
    };

    const response = await api
      .post("/user-indicate-mkt/", data, config)
      .then(() => {})
      .catch((err) => {
        toast.error(`${err.response.data.message} `);
        return err;
      });

    return response;
  };

  return (
    <SellerContext.Provider
      value={{
        CreateSeller,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};
