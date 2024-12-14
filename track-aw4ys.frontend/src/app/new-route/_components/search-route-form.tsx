import { Button } from "@/_components/ui/button";
import { Label } from "@/_components/ui/label";
import { Input } from "@/_components/ui/input";

type SearchRouteFormProps = {
  origin: string;
  destination: string;
};

export function SearchRouteForm({ origin, destination }: SearchRouteFormProps) {
  return (
    <form method="get" className="space-y-8 w-full">
      <div className="space-y-2">
        <Label htmlFor="source">Origem</Label>
        <Input
          id="source"
          name="source"
          placeholder="Insira o ponto inicial da rota"
          defaultValue={origin}
          type="search"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destino</Label>
        <Input
          id="destination"
          name="destination"
          placeholder="Insira o ponto final da rota"
          defaultValue={destination}
          type="search"
        />
      </div>

      <Button type="submit" className="w-full">
        Pesquisar
      </Button>
    </form>
  );
}
