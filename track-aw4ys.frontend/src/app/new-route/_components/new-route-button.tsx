"use client";

import { Button } from "@/_components/ui/button";
import { createRoute } from "../_actions/create-route";
import { useState } from "react";

type NewRouteButtonProps = {
  sourceId: string;
  destinationId: string;
};

export function NewRouteButton({
  sourceId,
  destinationId,
}: NewRouteButtonProps) {
  const [createNewRouteIsLoading, setCreateNewRouteIsLoading] = useState(false);

  const handleGenerateReportClick = async () => {
    try {
      setCreateNewRouteIsLoading(true);
      await createRoute({ sourceId, destinationId });
      // setReport(aiReport);
    } catch (error) {
      console.log(error);
    } finally {
      setCreateNewRouteIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateReportClick}
      disabled={createNewRouteIsLoading}
    >
      Adicionar rota
    </Button>
  );
}
