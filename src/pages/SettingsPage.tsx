import { Switch } from "@/components/ui/switch";
import { useRootStore } from "@/stores/root";

const SettingPage = () => {
  const { theme, toggleTheme } = useRootStore();

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">Dark Mode</span>
        <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
      </div>
    </div>
  );
}

export default SettingPage