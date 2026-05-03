import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { LoadingSpinner } from "./LoadingSpinner";
import { useTranslation } from "react-i18next";

export function GlobalLoadingSpinner() {
  const { t } = useTranslation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) return null;

  return <LoadingSpinner fullScreen message={t("common.loading")} />;
}
