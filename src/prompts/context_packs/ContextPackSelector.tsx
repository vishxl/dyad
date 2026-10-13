import { useAtom } from "jotai";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { contextPacksAtom } from "@/atoms/chatAtoms";
import {
  CONTEXT_PACKS,
  CONTEXT_PACK_IDS,
  type ContextPackId,
} from "./registry";

/**
 * Chat-bar chip for toggling vendor context packs on/off. Toggled packs are
 * injected into every new stream's system prompt.
 */
export function ContextPackSelector() {
  const [contextPacks, setContextPacks] = useAtom(contextPacksAtom);

  const togglePack = (id: ContextPackId) => {
    setContextPacks((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const enabledName = contextPacks
    .map((id) => CONTEXT_PACKS[id]?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              className={cn(
                "cursor-pointer px-2 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1",
                contextPacks.length > 0
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-foreground/80 hover:text-foreground hover:bg-muted/60",
              )}
              data-testid="context-pack-selector"
            />
          }
        >
          <BookOpen size={14} />
          <span className="truncate max-w-[150px]">
            {enabledName || "Context"}
          </span>
        </TooltipTrigger>
        <TooltipContent>Inject vendor documentation context</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Adds vendor docs to the AI's context for every message. Turn off
            when not building for that vendor.
          </div>
          {CONTEXT_PACK_IDS.map((id) => (
            <div key={id} className="flex items-center justify-between">
              <Label htmlFor={`context-pack-${id}`}>
                {CONTEXT_PACKS[id].name}
              </Label>
              <Switch
                id={`context-pack-${id}`}
                checked={contextPacks.includes(id)}
                onCheckedChange={() => togglePack(id)}
                data-testid={`context-pack-toggle-${id}`}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
