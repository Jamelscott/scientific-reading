import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { LoadingSpinner } from "./LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores";
import { useState, useEffect, useRef } from "react";

export function GlobalLoadingSpinner() {
  const { t } = useTranslation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const isLoading = isFetching > 0 || isMutating > 0 || isAuthLoading;

  if (!isLoading) return null;

  return <LoadingSpinner fullScreen />;
}
