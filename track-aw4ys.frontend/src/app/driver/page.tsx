import { MapDriver } from "./_components/map-driver";
import { StartRouteForm } from "./_components/start-route-form";

export async function getRoutes() {
  const response = await fetch(`${process.env.NEST_API_URL}/routes`, {
    cache: "force-cache",
    next: {
      tags: ["routes"],
    },
  });
  //revalidate por demanda
  return response.json();
}

export default async function DriverPage() {
  const routes = await getRoutes();

  return (
    <div className="h-[100vh] flex flex-col space-y-6 p-6">
      <div className="grid gap-6 h-full grid-cols-[1fr,2fr]">
        <div className=" h-full flex flex-col items-center justify-center">
          <div className="max-w-[480px] w-full">
            <h1 className="mb-3 text-2xl">Inicie uma rota</h1>

            <StartRouteForm routes={routes} />
          </div>
        </div>

        <div className="rounded-lg flex items-center justify-center">
          <MapDriver routeIdElementId={"routeId"} />
        </div>
      </div>
    </div>
  );
}
