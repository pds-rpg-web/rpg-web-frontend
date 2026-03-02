"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Swords, Crosshair, Wand2, Shield, 
  Heart, Skull, RefreshCw, Activity, Zap, LogOut
} from "lucide-react";

const CLASSES = {
  Guerreiro: { baseHp: 100, damageDice: 10, icon: Swords, color: "text-red-400", mainStat: "forca" },
  Ladino: { baseHp: 80, damageDice: 8, icon: Crosshair, color: "text-emerald-400", mainStat: "destreza" },
  Mago: { baseHp: 60, damageDice: 12, icon: Wand2, color: "text-blue-400", mainStat: "inteligencia" },
  Clerigo: { baseHp: 90, damageDice: 6, icon: Shield, color: "text-amber-400", mainStat: "inteligencia" },
};

type ClassName = keyof typeof CLASSES;

interface LogEntry {
  id: number;
  text: string;
  type: "info" | "player" | "enemy" | "dice" | "power";
}

const getMod = (value: number) => Math.floor((value - 10) / 2);

export default function CombatPage() {
  const router = useRouter();
  
  const [character, setCharacter] = useState<any>(null);
  
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [isDefending, setIsDefending] = useState(false);
  const [powerCooldown, setPowerCooldown] = useState(0);
  const [shadowStepActive, setShadowStepActive] = useState(false);
  const [enemyHp, setEnemyHp] = useState(80);
  const enemyMaxHp = 80;
  const enemyAC = 12; 
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChar = localStorage.getItem("rpg-character");
    if (savedChar) {
      const parsed = JSON.parse(savedChar);
      setCharacter(parsed);
      
      const classData = CLASSES[parsed.classe as ClassName] || CLASSES["Guerreiro"];
      const strMod = getMod(Number(parsed.forca));
      const maxHealth = classData.baseHp + (strMod * 5);
      
      setPlayerMaxHp(maxHealth);
      setPlayerHp(maxHealth);
      
      setLogs([{ id: Date.now(), text: `Um ${parsed.raca} ${parsed.classe} entra na arena!`, type: "info" }]);
    } else {
      router.push("/create-character");
    }
  }, [router]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!character) return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500">Invocando herói...</div>;

  const classData = CLASSES[character.classe as ClassName] || CLASSES["Guerreiro"];
  const mainStatValue = Number(character[classData.mainStat]);
  const combatModifier = getMod(mainStatValue);

  const handleLogout = () => {
    router.push("/");
    toast.info("Você fugiu da batalha e saiu da guilda.");
  };

  const addLog = (text: string, type: LogEntry["type"]) => {
    setLogs((prev) => [...prev, { id: Date.now() + Math.random(), text, type }]);
  };

  const rollDice = (sides: number) => {
    return Math.floor(Math.random() * sides) + 1;
  };

  const enemyTurn = () => {
    if (enemyHp <= 0) return;

    setPowerCooldown(prev => Math.max(0, prev - 1));

    addLog("O inimigo ataca!", "info");
    const attackRoll = rollDice(20) + 2;
    addLog(`🎲 Inimigo rolou Ataque: ${attackRoll}`, "dice");

    const playerAC = 10 + getMod(Number(character.destreza));

    if (attackRoll >= playerAC) {
      let damage = rollDice(6) + 1;
      
      if (isDefending) {
        damage = Math.floor(damage / 2);
        addLog(`🛡️ Você bloqueou parte do golpe! Dano reduzido.`, "player");
        setIsDefending(false);
      }

      setPlayerHp((prev) => Math.max(0, prev - damage));
      addLog(`💥 O Goblin te acertou e causou ${damage} de dano!`, "enemy");
    } else {
      addLog("💨 O Goblin errou o ataque!", "enemy");
      setIsDefending(false);
    }
  };

  const handleAttack = () => {
    if (playerHp <= 0 || enemyHp <= 0) return;
    setIsDefending(false);

    addLog(`Você ataca usando sua ${classData.mainStat}!`, "player");
    
    const d20 = rollDice(20);
    const attackRoll = d20 + combatModifier;
    
    addLog(`🎲 Rolou D20 (${d20}) + ${combatModifier} (Mod): Total ${attackRoll}`, "dice");

    if (attackRoll >= enemyAC || d20 === 20) {
      let damage = rollDice(classData.damageDice) + combatModifier;
      damage = Math.max(1, damage); 

      if (shadowStepActive) {
        damage *= 2;
        addLog("🗡️ ATAQUE FURTIVO CRÍTICO!", "power");
        setShadowStepActive(false);
      }

      setEnemyHp((prev) => {
        const newHp = Math.max(0, prev - damage);
        if (newHp === 0) addLog("🏆 Vitória Épica! O inimigo caiu.", "info");
        return newHp;
      });
      addLog(`⚔️ Acerto em cheio! Causou ${damage} de dano.`, "player");
    } else {
      addLog("❌ Seu ataque resvalou na armadura do inimigo.", "player");
    }

    setTimeout(enemyTurn, 1000);
  };

  const handleDefend = () => {
    if (playerHp <= 0 || enemyHp <= 0) return;
    setIsDefending(true);
    addLog("🛡️ Você ergue suas defesas usando sua agilidade.", "player");
    setTimeout(enemyTurn, 1000);
  };

  const handlePower = () => {
    if (powerCooldown > 0 || playerHp <= 0 || enemyHp <= 0) return;
    setIsDefending(false);
    
    const poder = character.poderPrincipal;
    addLog(`✨ Você canaliza seu poder: ${poder}!`, "power");

    if (poder === "Golpe Devastador") {
      const dano = classData.damageDice + getMod(Number(character.forca)) + 10;
      setEnemyHp(prev => Math.max(0, prev - dano));
      addLog(`💥 Um impacto brutal! Causou ${dano} de dano.`, "player");
    } 
    else if (poder === "Chama Eterna") {
      const dano = rollDice(6) + rollDice(6) + getMod(Number(character.inteligencia)) + 5;
      setEnemyHp(prev => Math.max(0, prev - dano));
      addLog(`🔥 O fogo sagrado engole o inimigo! Causou ${dano} de dano.`, "player");
    }
    else if (poder === "Passos de Sombra") {
      setShadowStepActive(true);
      addLog(`🌫️ Você desaparece nas sombras. Seu próximo ataque causará o dobro de dano!`, "player");
    }
    else if (poder === "Luz Guiadora") {
      const cura = rollDice(8) + getMod(Number(character.inteligencia)) + 15;
      setPlayerHp(prev => Math.min(playerMaxHp, prev + cura));
      addLog(`💖 Uma luz radiante restaura suas feridas. Curou ${cura} de HP.`, "player");
    }

    setPowerCooldown(3); 
    setTimeout(enemyTurn, 1500);
  };

  const resetCombat = () => {
    setPlayerHp(playerMaxHp);
    setEnemyHp(enemyMaxHp);
    setPowerCooldown(0);
    setShadowStepActive(false);
    setLogs([{ id: Date.now(), text: "Uma nova ameaça surge na arena!", type: "info" }]);
    setIsDefending(false);
  };

  const isGameOver = playerHp <= 0 || enemyHp <= 0;

  return (
    <div className="relative flex min-h-screen flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-black font-sans text-zinc-50 selection:bg-amber-900/50 dark overflow-x-hidden">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      {/* Cabeçalho com Logout */}
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

      <div className="z-10 max-w-5xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tighter bg-linear-to-b from-amber-100 to-amber-600 bg-clip-text text-transparent">
            Arena de Batalha
          </h1>
          <p className="text-zinc-400 font-medium">
            {character.raca} {character.classe} • Força: {character.forca} | Destreza: {character.destreza} | Int: {character.inteligencia}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card do Jogador */}
          <Card className={`border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shadow-2xl text-zinc-100 transition-all ${playerHp <= 0 ? "opacity-60 grayscale" : ""}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-amber-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserAvatar icon={classData.icon} color={classData.color} />
                  Seu Herói
                </div>
                {shadowStepActive && <span className="text-xs text-purple-400 animate-pulse border border-purple-500/30 px-2 py-1 rounded">Invisível</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between font-bold text-zinc-300">
                <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-emerald-400" /> {playerHp} / {playerMaxHp}</span>
                {isDefending && <span className="text-blue-400 text-sm animate-pulse">Defendendo 🛡️</span>}
              </div>
              <div className="w-full bg-zinc-900 h-4 rounded-full overflow-hidden mb-8 border border-zinc-800">
                <div className="bg-linear-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${(playerHp / playerMaxHp) * 100}%` }} />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button onClick={handleAttack} disabled={isGameOver} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-600 transition-all duration-300 font-semibold h-12">
                    <Swords className="mr-2 h-5 w-5" /> Atacar
                  </Button>
                  <Button onClick={handleDefend} disabled={isGameOver} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-600 transition-all duration-300 font-semibold h-12">
                    <Shield className="mr-2 h-5 w-5" /> Defender
                  </Button>
                </div>
                
                <Button 
                  onClick={handlePower} 
                  disabled={isGameOver || powerCooldown > 0} 
                  className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)] border border-amber-500/30 transition-all duration-300 font-bold text-md h-12 disabled:opacity-50"
                >
                  <Zap className="mr-2 h-5 w-5" /> 
                  {powerCooldown > 0 ? `${character.poderPrincipal} (Recarrega em ${powerCooldown})` : character.poderPrincipal}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card do Inimigo */}
          <Card className={`border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shadow-2xl text-zinc-100 transition-all ${enemyHp <= 0 ? "opacity-60 grayscale" : ""}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-red-200 flex items-center gap-2">
                 <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800"><Skull className="h-6 w-6 text-red-500" /></div>
                 Goblin (AC: {enemyAC})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between font-bold text-zinc-300">
                <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-red-400" /> {enemyHp} / {enemyMaxHp}</span>
              </div>
              <div className="w-full bg-zinc-900 h-4 rounded-full overflow-hidden mb-6 border border-zinc-800">
                <div className="bg-linear-to-r from-red-600 to-red-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(248,113,113,0.5)]" style={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log de Combate */}
        <Card className="border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shadow-2xl text-zinc-100 mt-8">
          <CardHeader className="border-b border-zinc-800/80 pb-4">
            <CardTitle className="flex justify-between items-center text-amber-100">
              <span className="flex items-center gap-2"><RefreshCw className="h-5 w-5" /> Diário de Combate</span>
              {isGameOver && (
                <Button onClick={resetCombat} size="sm" className="bg-amber-600 hover:bg-amber-500 text-white">
                  Próxima Batalha
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72 overflow-y-auto rounded-md p-4 font-mono text-sm flex flex-col gap-3 bg-zinc-900/60 border border-zinc-800 shadow-inner custom-scrollbar">
              {logs.length === 0 && <span className="text-zinc-500 italic text-center mt-auto mb-auto">Aguardando início do combate...</span>}
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`flex gap-2 items-start 
                    ${log.type === "player" ? "text-emerald-300" : ""} 
                    ${log.type === "enemy" ? "text-red-400" : ""} 
                    ${log.type === "dice" ? "text-amber-400/80 text-xs mt-1" : ""} 
                    ${log.type === "power" ? "text-amber-400 font-bold bg-amber-900/20 px-2 py-1 rounded w-fit" : ""} 
                    ${log.type === "info" ? "text-zinc-400 italic" : ""}`}
                >
                  {log.type === "dice" ? "🎲" : log.type === "power" ? "✨" : log.type === "info" ? "📜" : log.type === "player" ? "▶" : "◀"}
                  <span>{log.text}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserAvatar({ icon: Icon, color }: { icon: any, color: string }) {
  return (
    <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800">
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
  );
}