"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Swords, Wand2, Shield, Crosshair,
    User, Mountain, Leaf, Flame,
    Dumbbell, PersonStanding, Brain, BookOpen,
    LogOut, ArrowRight, ArrowLeft
} from "lucide-react";

export default function CriarPersonagemPage() {
    const router = useRouter();

    // Controle do passo a passo
    const [currentStep, setCurrentStep] = useState("identidade");
    const steps = ["identidade", "classe", "poderes"];

    const [character, setCharacter] = useState({
        raca: "",
        classe: "",
        forca: 10,
        destreza: 10,
        inteligencia: 10,
        poderPrincipal: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCharacter((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelection = (field: string, value: string) => {
        setCharacter((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveCharacter = () => {
        localStorage.setItem("rpg-character", JSON.stringify(character));

        toast.success("Personagem criado com sucesso!", {
            description: "Sua jornada épica está prestes a começar.",
        });
        
        router.push("/combat");
    };

    const handleLogout = () => {
        router.push("/");
        toast.info("Você saiu da guilda.");
    };

    const goNext = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    };

    const goPrev = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    };

    const canGoNext = () => {
        if (currentStep === "identidade") return character.raca !== "";
        if (currentStep === "classe") return character.classe !== "";
        return false;
    };

    const isFormValid = character.raca && character.classe && character.poderPrincipal;

    return (
        <div className="relative flex min-h-screen flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-black font-sans text-zinc-50 selection:bg-amber-900/50 dark overflow-x-hidden">
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

            <div className="z-20 w-full max-w-5xl flex justify-end mb-4">
                <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Deslogar
                </Button>
            </div>

            <div className="z-10 max-w-4xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">

                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 border border-amber-500/30 shadow-[0_0_40px_rgba(217,119,6,0.2)]">
                        <BookOpen className="h-10 w-10 text-amber-500" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tighter bg-linear-to-b from-amber-100 to-amber-600 bg-clip-text text-transparent lg:text-5xl">
                        O Tomo da Criação
                    </h1>
                    <p className="text-lg text-zinc-400 font-medium max-w-2xl mx-auto">
                        Molde seu avatar. Suas escolhas aqui ecoarão pela eternidade.
                    </p>
                </div>

                <div className="flex justify-center items-center gap-2 text-sm font-medium text-amber-500/80 bg-amber-950/30 border border-amber-900/50 px-4 py-2 rounded-full w-fit mx-auto">
                    Passo {steps.indexOf(currentStep) + 1} de {steps.length}
                </div>

                <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 text-zinc-400 min-h-12 rounded-lg gap-1 pointer-events-none">
                        <TabsTrigger value="identidade" className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm transition-all rounded-md">1. Origem</TabsTrigger>
                        <TabsTrigger value="classe" className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm transition-all rounded-md">2. Caminho</TabsTrigger>
                        <TabsTrigger value="poderes" className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm transition-all rounded-md">3. Dádivas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="identidade" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                        <Card className="border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shadow-2xl text-zinc-100">
                            <CardHeader>
                                <CardTitle className="text-2xl text-amber-100">Linhagem Sanguínea</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Escolha a raça do seu personagem. Cada linhagem traz sua própria história para o mundo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { id: "Humano", icon: User, desc: "Versáteis e ambiciosos." },
                                        { id: "Elfo", icon: Leaf, desc: "Ágeis e sintonizados com a magia." },
                                        { id: "Anao", icon: Mountain, desc: "Resistentes e mestres forjadores." },
                                        { id: "Orc", icon: Flame, desc: "Ferozes e dotados de força brutal." }
                                    ].map((raca) => (
                                        <div
                                            key={raca.id}
                                            onClick={() => handleSelection('raca', raca.id)}
                                            className={`flex flex-col items-center text-center p-6 rounded-xl border cursor-pointer transition-all duration-300 ${character.raca === raca.id
                                                    ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(217,119,6,0.15)] scale-105"
                                                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800"
                                                }`}
                                        >
                                            <raca.icon className={`h-12 w-12 mb-4 ${character.raca === raca.id ? "text-amber-400" : "text-zinc-500"}`} />
                                            <h3 className="font-bold text-lg">{raca.id}</h3>
                                            <p className="text-xs text-zinc-400 mt-2">{raca.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="classe" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                        <Card className="border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shadow-2xl text-zinc-100">
                            <CardHeader>
                                <CardTitle className="text-2xl text-amber-100">Caminho Marcial ou Mágico</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Defina a vocação do seu herói e treine seus atributos iniciais.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { id: "Guerreiro", icon: Swords, color: "text-red-400", desc: "Mestres do combate corpo-a-corpo." },
                                        { id: "Ladino", icon: Crosshair, color: "text-emerald-400", desc: "Especialistas em furtividade e precisão." },
                                        { id: "Mago", icon: Wand2, color: "text-blue-400", desc: "Conjuradores de magias arcanas destrutivas." },
                                        { id: "Clerigo", icon: Shield, color: "text-amber-400", desc: "Guerreiros santos focados em suporte e cura." }
                                    ].map((cls) => (
                                        <div
                                            key={cls.id}
                                            onClick={() => handleSelection('classe', cls.id)}
                                            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${character.classe === cls.id
                                                    ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(217,119,6,0.15)]"
                                                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                                                }`}
                                        >
                                            <div className={`p-3 rounded-full bg-zinc-950 border border-zinc-800 mr-4 ${character.classe === cls.id ? 'border-amber-500/50' : ''}`}>
                                                <cls.icon className={`h-6 w-6 ${character.classe === cls.id ? 'text-amber-500' : cls.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{cls.id}</h3>
                                                <p className="text-sm text-zinc-400">{cls.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-zinc-800/80">
                                    <h3 className="text-lg font-semibold mb-4 text-zinc-200">Atributos Básicos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="forca" className="flex items-center gap-2 text-zinc-300">
                                                <Dumbbell className="h-4 w-4 text-red-400" /> Força
                                            </Label>
                                            <Input id="forca" name="forca" type="number" min="1" max="20" value={character.forca} onChange={handleInputChange} className="bg-zinc-900/50 border-zinc-800 text-white focus-visible:ring-amber-500/30" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="destreza" className="flex items-center gap-2 text-zinc-300">
                                                <PersonStanding className="h-4 w-4 text-emerald-400" /> Destreza
                                            </Label>
                                            <Input id="destreza" name="destreza" type="number" min="1" max="20" value={character.destreza} onChange={handleInputChange} className="bg-zinc-900/50 border-zinc-800 text-white focus-visible:ring-amber-500/30" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="inteligencia" className="flex items-center gap-2 text-zinc-300">
                                                <Brain className="h-4 w-4 text-blue-400" /> Inteligência
                                            </Label>
                                            <Input id="inteligencia" name="inteligencia" type="number" min="1" max="20" value={character.inteligencia} onChange={handleInputChange} className="bg-zinc-900/50 border-zinc-800 text-white focus-visible:ring-amber-500/30" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="poderes" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                        <Card className="border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shadow-2xl text-zinc-100">
                            <CardHeader>
                                <CardTitle className="text-2xl text-amber-100">Dádiva Inicial</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Escolha a habilidade especial que o destaca dos aventureiros comuns.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { nome: "Golpe Devastador", desc: "Ataque físico que ignora armadura e destrói escudos." },
                                        { nome: "Chama Eterna", desc: "Invoca um fogo mágico garantido usando pura inteligência." },
                                        { nome: "Passos de Sombra", desc: "Fica invisível e causa dano dobrado no próximo ataque." },
                                        { nome: "Luz Guiadora", desc: "Restaura os próprios ferimentos em batalha." }
                                    ].map((poder) => (
                                        <div
                                            key={poder.nome}
                                            onClick={() => handleSelection('poderPrincipal', poder.nome)}
                                            className={`relative overflow-hidden p-5 rounded-xl border cursor-pointer transition-all duration-300 ${character.poderPrincipal === poder.nome
                                                    ? "border-amber-500 bg-linear-to-br from-amber-500/20 to-transparent shadow-[0_0_20px_rgba(217,119,6,0.15)] scale-[1.02]"
                                                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                                                }`}
                                        >
                                            {character.poderPrincipal === poder.nome && (
                                                <div className="absolute top-0 right-0 p-2">
                                                    <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)] animate-pulse"></div>
                                                </div>
                                            )}
                                            <h3 className="font-bold text-amber-50 text-lg">{poder.nome}</h3>
                                            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{poder.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Botões de Navegação (Wizard) */}
                <div className="flex justify-between items-center mt-8 gap-4">
                    <Button 
                        onClick={goPrev} 
                        disabled={currentStep === "identidade"}
                        variant="outline"
                        className="bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>

                    {currentStep !== "poderes" ? (
                        <Button 
                            onClick={goNext} 
                            disabled={!canGoNext()}
                            className="bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                        >
                            Avançar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSaveCharacter}
                            disabled={!isFormValid}
                            className="bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-500/30 transition-all font-semibold"
                        >
                            <Swords className="mr-2 h-5 w-5" />
                            Concluir e Iniciar
                        </Button>
                    )}
                </div>

            </div>
        </div>
    );
}