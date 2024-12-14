import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ routeId: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  console.log("entrou nesse get aqui do routes");

  const { routeId } = await params;
  const response = await fetch(`http://localhost:3000/routes/${routeId}`, {
    cache: "force-cache",
    next: {
      tags: [`routes-${routeId}`, "routes"],
    },
  });
  const data = await response.json();

  return NextResponse.json(data);
}
