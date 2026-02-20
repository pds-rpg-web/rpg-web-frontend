"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Mail, Lock, User, Shield, Swords, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailLogin || !passwordLogin) {
      toast.error("Preencha seu pergaminho!", {
        description: "E-mail e senha são obrigatórios para entrar na Taverna.",
      });
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      
      if (passwordLogin === "errado") {
        toast.error("Acesso negado!", {
          description: "As credenciais fornecidas não são reconhecidas pela guilda.",
        });
        return;
      }

      toast.success("Bem-vindo de volta!", {
        description: "A taverna estava à sua espera. Puxe uma cadeira!",
      });

      router.push("/create-character");
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !emailRegister || !passwordRegister || !passwordConfirm) {
      toast.error("Faltam informações!", {
        description: "Preencha todos os campos para forjar seu destino.",
      });
      return;
    }

    if (passwordRegister !== passwordConfirm) {
      toast.error("Palavras mágicas divergentes!", {
        description: "As senhas digitadas não coincidem. Tente novamente.",
      });
      return;
    }

    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      
      toast.success("Juramento Aceito!", {
        description: `Seja bem-vindo à Guilda Digital, ${username}!`,
      });

      setUsername("");
      setEmailRegister("");
      setPasswordRegister("");
      setPasswordConfirm("");

      router.push("/create-character");
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4 font-sans text-zinc-50 selection:bg-amber-900/50 dark">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <main className="z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_0_30px_rgba(217,119,6,0.15)]">
            <Swords className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter bg-linear-to-b from-amber-100 to-amber-600 bg-clip-text text-transparent">
            Guilda Digital
          </h1>
          <p className="mt-2 text-zinc-400 font-medium">
            Sua jornada épica começa aqui.
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 p-1 text-zinc-400">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-amber-900/20 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm transition-all"
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-amber-900/20 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm transition-all"
            >
              Criar Personagem
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
            <form onSubmit={handleLogin}>
              <Card className="border-zinc-800/60 bg-zinc-950/60 backdrop-blur-xl shadow-2xl shadow-black/50 text-zinc-100">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    Retornar à Taverna
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Insira suas credenciais para continuar sua campanha.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email-login" className="text-zinc-300">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        id="email-login"
                        type="email"
                        value={emailLogin}
                        onChange={(e) => setEmailLogin(e.target.value)}
                        placeholder="mago@exemplo.com"
                        className="pl-10 border-zinc-800 bg-zinc-900/50 placeholder:text-zinc-600 focus-visible:ring-amber-500/30 focus-visible:border-amber-600/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login" className="text-zinc-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        id="password-login"
                        type="password"
                        value={passwordLogin}
                        onChange={(e) => setPasswordLogin(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 border-zinc-800 bg-zinc-900/50 placeholder:text-zinc-600 focus-visible:ring-amber-500/30 focus-visible:border-amber-600/50 transition-colors"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isLoggingIn}
                    className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_25px_rgba(217,119,6,0.4)] border border-amber-500/30 transition-all duration-300 font-semibold tracking-wide disabled:opacity-70"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
            <form onSubmit={handleRegister}>
              <Card className="border-zinc-800/60 bg-zinc-950/60 backdrop-blur-xl shadow-2xl shadow-black/50 text-zinc-100">
                <CardHeader>
                  <CardTitle className="text-2xl">Forjar um Novo Destino</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Preencha os dados para criar sua conta na guilda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-zinc-300">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Aragorn, o Bravo"
                        className="pl-10 border-zinc-800 bg-zinc-900/50 placeholder:text-zinc-600 focus-visible:ring-amber-500/30 focus-visible:border-amber-600/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register" className="text-zinc-300">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        id="email-register"
                        type="email"
                        value={emailRegister}
                        onChange={(e) => setEmailRegister(e.target.value)}
                        placeholder="heroi@exemplo.com"
                        className="pl-10 border-zinc-800 bg-zinc-900/50 placeholder:text-zinc-600 focus-visible:ring-amber-500/30 focus-visible:border-amber-600/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register" className="text-zinc-300">Senha</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        id="password-register"
                        type="password"
                        value={passwordRegister}
                        onChange={(e) => setPasswordRegister(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 border-zinc-800 bg-zinc-900/50 placeholder:text-zinc-600 focus-visible:ring-amber-500/30 focus-visible:border-amber-600/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm" className="text-zinc-300">Confirme sua senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        id="password-confirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 border-zinc-800 bg-zinc-900/50 placeholder:text-zinc-600 focus-visible:ring-amber-500/30 focus-visible:border-amber-600/50 transition-colors"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isRegistering}
                    className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_25px_rgba(217,119,6,0.4)] border border-amber-500/30 transition-all duration-300 font-semibold tracking-wide disabled:opacity-70"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Forjando...
                      </>
                    ) : (
                      "Cadastre-se"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}