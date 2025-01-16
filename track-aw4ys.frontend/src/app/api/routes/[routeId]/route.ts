import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ routeId: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { routeId } = await params;
  const response = await fetch(
    `${process.env.NEST_API_URL}/routes/${routeId}`,
    {
      cache: "force-cache",
      next: {
        tags: [`routes-${routeId}`, "routes"],
      },
    }
  );
  const data = await response.json();

  return NextResponse.json(data);
}
