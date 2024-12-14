import { Button } from "@/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import type { RouteType } from "@/_types/route";

type StartRouteFormProps = {
  routeId: string | undefined;
  routes: RouteType[];
};

export function StartRouteForm({ routes, routeId }: StartRouteFormProps) {
  return (
    <form method="get" className="space-y-8 w-full">
      <Select name="route_id" defaultValue={routeId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma rota" />
        </SelectTrigger>
        <SelectContent>
          {routes.map((route) => (
            <SelectItem key={route.id} value={route.id}>
              {route.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full">
        Iniciar a viagem
      </Button>
    </form>
  );
}
