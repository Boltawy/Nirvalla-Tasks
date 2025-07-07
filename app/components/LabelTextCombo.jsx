import { Label } from "@radix-ui/react-label";

export default function LabelTextCombo({ label, text }) {
  return (
    <div className="flex justify-between">
      <Label htmlFor="password">{label}</Label>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
