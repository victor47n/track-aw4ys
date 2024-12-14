import { MapDriver } from "./_components/map-driver";
import { StartRouteForm } from "./_components/start-route-form";

export async function getRoutes() {
  const response = await fetch("http://localhost:3000/routes", {
    cache: "force-cache",
    next: {
      tags: ["routes"],
    },
  });
  //revalidate por demanda
  return response.json();
}

export async function getRoute(routeId: string) {
  const response = await fetch(`http://localhost:3000/routes/${routeId}`, {
    cache: "force-cache",
    next: {
      tags: [`routes-${routeId}`, "routes"],
    },
  });
  //revalidate por demanda
  return response.json();
}

type SearchParamsProps = Promise<{ route_id: string }>;

export default async function DriverPage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const routes = await getRoutes();
  const { route_id: routeId } = await searchParams;

  let startLocation = null;
  let endLocation = null;

  if (routeId) {
    const route = await getRoute(routeId);
    const { start_location, end_location } = route.directions.routes[0].legs[0];

    startLocation = start_location;
    endLocation = end_location;
  }

  return (
    <div className="h-[100vh] flex flex-col space-y-6 p-6">
      <div className="grid gap-6 h-full grid-cols-[1fr,2fr]">
        <div className=" h-full flex flex-col items-center justify-center">
          <div className="max-w-[480px] w-full">
            <h1 className="mb-3 text-2xl">Inicie uma rota</h1>

            <StartRouteForm routes={routes} routeId={routeId} />
          </div>
        </div>

        <div className="rounded-lg flex items-center justify-center">
          <MapDriver
            routeId={routeId}
            startLocation={startLocation}
            endLocation={endLocation}
          />
        </div>
      </div>
    </div>
  );
}
