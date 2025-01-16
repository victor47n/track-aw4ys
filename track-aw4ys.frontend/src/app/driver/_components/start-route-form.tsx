"use client";

import { Button } from "@/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import type { RouteType } from "@/_types/route";
import { startRoute } from "../_actions/start-route";
import { useState, type FormEvent } from "react";

type StartRouteFormProps = {
  routes: RouteType[];
};

export function StartRouteForm({ routes }: StartRouteFormProps) {
  const [startRouteIsLoading, setStartIsLoading] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

  const handleStartRoute = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("handle no start-route-form");

    try {
      setStartIsLoading(true);

      await startRoute({ routeId: selectedRouteId });
    } catch (error) {
      console.log(error);
    } finally {
      setStartIsLoading(false);
    }
  };

  const handleRouteChange = (value: string) => {
    console.log("mudando valor handleRouteChange", value);
    setSelectedRouteId(value);
  };

  return (
    <form onSubmit={handleStartRoute} className="space-y-8 w-full">
      <Select name="routeId" onValueChange={handleRouteChange}>
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

      <Button type="submit" className="w-full" disabled={startRouteIsLoading}>
        Iniciar a viagem
      </Button>
    </form>
  );
}
