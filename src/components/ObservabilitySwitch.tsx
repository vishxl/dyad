import { useSettings } from "@/hooks/useSettings";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

export function ObservabilitySwitch() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation("settings");
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="observability-switch"
        aria-label="Observability"
        checked={settings?.observabilityEnabled ?? true}
        onCheckedChange={(checked) => {
          updateSettings({ observabilityEnabled: checked });
        }}
      />
      <Label htmlFor="observability-switch">{t("observability.enable")}</Label>
    </div>
  );
}
