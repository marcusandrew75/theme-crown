import { TemplateTile } from "@/components/template-tile";
import { chooseSandboxPersona } from "@/app/login/sandbox-actions";
import { SANDBOX_PERSONAS } from "@/lib/demo-sandbox";

export function PersonaPicker({ next }: { next: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SANDBOX_PERSONAS.map((persona) => (
        <form key={persona.id} action={chooseSandboxPersona}>
          <input type="hidden" name="personaId" value={persona.id} />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="flex w-full flex-col items-center gap-2 rounded-[3px] border border-[var(--line-strong)] bg-[var(--surface)] p-4 text-center transition-colors hover:border-[var(--accent)]"
          >
            <TemplateTile title={persona.name} className="h-11 w-11 text-[16px]" />
            <span className="text-[14px] font-medium text-[var(--ink)]">
              {persona.name}
            </span>
            <span className="text-[12px] text-[var(--ink-faint)]">
              {persona.handle}
            </span>
          </button>
        </form>
      ))}
    </div>
  );
}
