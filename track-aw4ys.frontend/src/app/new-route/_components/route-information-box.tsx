import { Card, CardContent, CardFooter } from "@/_components/ui/card";
import { NewRouteButton } from "./new-route-button";

interface RouteInformationBoxProps {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  sourceId: string;
  destinationId: string;
}

export function RouteInformationBox({
  origin,
  destination,
  distance,
  duration,
  sourceId,
  destinationId,
}: RouteInformationBoxProps) {
  return (
    <Card className="mt-4 items-center justify-center bg-secondary w-full">
      <CardContent className="flex flex-col gap-2 p-6">
        <span>Origem: {origin}</span>
        <span>Destino: {destination}</span>
        <span>Distância: {distance}</span>
        <span>Duração: {duration}</span>
      </CardContent>
      <CardFooter>
        <NewRouteButton sourceId={sourceId} destinationId={destinationId} />
      </CardFooter>
    </Card>
  );
}
