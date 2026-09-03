import { TemplateTile } from "@/components/template-tile";
import { chooseSandboxPersona } from "@/app/login/sandbox-actions";
import { SANDBOX_PERSONAS } from "@/lib/demo-sandbox";

export function PersonaPicker({
  next,
  activePersonaId,
}: {
  next: string;
  activePersonaId: string | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SANDBOX_PERSONAS.map((persona) => {
        const isActive = persona.id === activePersonaId;
        return (
          <form key={persona.id} action={chooseSandboxPersona}>
            <input type="hidden" name="personaId" value={persona.id} />
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="relative flex w-full flex-col items-center gap-2 rounded-2xl p-4 text-center shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-md)]"
              style={{
                background: isActive ? "var(--accent-soft)" : "var(--surface)",
              }}
            >
              {isActive && (
                <span
                  className="mono absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.04em] uppercase"
                  style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                >
                  Active
                </span>
              )}
              <TemplateTile title={persona.name} className="h-11 w-11 text-[16px]" />
              <span className="text-[14px] font-medium text-[var(--ink)]">
                {persona.name}
              </span>
              <span className="text-[12px] text-[var(--ink-faint)]">
                {persona.handle}
              </span>
            </button>
          </form>
        );
      })}
    </div>
  );
}
