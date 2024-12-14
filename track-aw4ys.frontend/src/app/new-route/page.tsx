import { SearchRouteForm } from "./_components/search-route-form";
import { RouteInformationBox } from "./_components/route-information-box";
import { MapNewRoute } from "./_components/map-new-route";

export async function handleSearchDirections(
  source: string,
  destination: string
) {
  const [sourceResponse, destinationResponse] = await Promise.all([
    fetch(`http://localhost:3000/places?text=${source}`, {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }),
    fetch(`http://localhost:3000/places?text=${destination}`, {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }),
  ]);

  if (!sourceResponse.ok) {
    throw new Error("Error fetching sourcec data");
  }

  if (!destinationResponse.ok) {
    throw new Error("Error fetching destination data");
  }

  const [sourceData, destinationData] = await Promise.all([
    sourceResponse.json(),
    destinationResponse.json(),
  ]);

  const placeSourceId = sourceData.candidates[0].place_id;
  const placeDestinationId = destinationData.candidates[0].place_id;

  const directionsResponse = await fetch(
    `http://localhost:3000/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`,
    {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }
  );

  if (!directionsResponse.ok) {
    throw new Error("Error fetching directions data");
  }

  const directionsData = await directionsResponse.json();

  return {
    directionsData,
    placeSourceId,
    placeDestinationId,
  };
}

type SearchParamsProps = Promise<{ source: string; destination: string }>;

export default async function NewRoutePage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const { source, destination } = await searchParams;

  const result =
    source && destination
      ? await handleSearchDirections(source, destination)
      : null;

  let directionsData = null;
  let placeSourceId = null;
  let placeDestinationId = null;

  if (result) {
    directionsData = result.directionsData;
    placeSourceId = result.placeSourceId;
    placeDestinationId = result.placeDestinationId;
  }

  return (
    <div className="h-[100vh] flex flex-col space-y-6 p-6">
      <div className="grid gap-6 h-full grid-cols-[1fr,2fr]">
        <div className=" h-full flex flex-col items-center justify-center">
          <div className="max-w-[480px] w-full">
            <h1 className="mb-3 text-2xl">Criar uma nova rota</h1>

            <SearchRouteForm origin={source} destination={destination} />

            {directionsData && (
              <RouteInformationBox
                origin={directionsData.routes[0].legs[0].start_address}
                destination={directionsData.routes[0].legs[0].end_address}
                distance={directionsData.routes[0].legs[0].distance.text}
                duration={directionsData.routes[0].legs[0].duration.text}
                sourceId={placeSourceId}
                destinationId={placeDestinationId}
              />
            )}
          </div>
        </div>

        <div className="rounded-lg flex items-center justify-center">
          <MapNewRoute directionsData={directionsData} />
        </div>
      </div>
    </div>
  );
}
