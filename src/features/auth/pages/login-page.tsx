import * as React from "react";
import { Logo } from "@/components/logo";
import { HeaderCircle } from "@/components/layouts/header-circle";
import { AuthPageLayout } from "@/components/layouts/auth-page-layout";
import { LoginForm } from "../components/login-form";

const LoginPage = () => {
  return (
    <AuthPageLayout>
      <section className="container w-full space-y-6 p-3 py-24 md:max-w-md">
        <Logo variant="primary" className="mx-auto" />
        <HeaderCircle isAuth title="Masukkan Akun Admin" />
        <LoginForm />
      </section>
    </AuthPageLayout>
  );
};
export default LoginPage;
