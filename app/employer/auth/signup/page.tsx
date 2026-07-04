import { EmployerAuthWelcomeScreen } from "@/components/employer/employer-auth-welcome-screen";

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function EmployerSignupPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <EmployerAuthWelcomeScreen
      mode="signup"
      nextPath={next ?? "/employer/discover"}
    />
  );
}
