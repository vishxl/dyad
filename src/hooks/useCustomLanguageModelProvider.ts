import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ipc,
  type CreateCustomLanguageModelProviderParams,
  type LanguageModelProvider,
} from "@/ipc/types";
import { showError } from "@/lib/toast";
import { queryKeys } from "@/lib/queryKeys";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";

export function useCustomLanguageModelProvider() {
  const queryClient = useQueryClient();

  const createProviderMutation = useMutation({
    mutationFn: async (
      params: CreateCustomLanguageModelProviderParams,
    ): Promise<LanguageModelProvider> => {
      if (!params.id.trim()) {
        throw new NextBillionError(
          "Provider ID is required",
          NextBillionErrorKind.Validation,
        );
      }
      if (!params.name.trim()) {
        throw new NextBillionError(
          "Provider name is required",
          NextBillionErrorKind.Validation,
        );
      }
      if (!params.apiBaseUrl.trim()) {
        throw new NextBillionError(
          "API base URL is required",
          NextBillionErrorKind.Validation,
        );
      }

      return ipc.languageModel.createCustomProvider({
        id: params.id.trim(),
        name: params.name.trim(),
        apiBaseUrl: params.apiBaseUrl.trim(),
        envVarName: params.envVarName?.trim() || undefined,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.languageModels.providers,
      });
    },
    onError: (error) => {
      showError(error);
    },
  });

  const editProviderMutation = useMutation({
    mutationFn: async (
      params: CreateCustomLanguageModelProviderParams,
    ): Promise<LanguageModelProvider> => {
      if (!params.id.trim()) {
        throw new NextBillionError(
          "Provider ID is required",
          NextBillionErrorKind.Validation,
        );
      }
      if (!params.name.trim()) {
        throw new NextBillionError(
          "Provider name is required",
          NextBillionErrorKind.Validation,
        );
      }
      if (!params.apiBaseUrl.trim()) {
        throw new NextBillionError(
          "API base URL is required",
          NextBillionErrorKind.Validation,
        );
      }

      return ipc.languageModel.editCustomProvider({
        id: params.id.trim(),
        name: params.name.trim(),
        apiBaseUrl: params.apiBaseUrl.trim(),
        envVarName: params.envVarName?.trim() || undefined,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.languageModels.providers,
      });
    },
    onError: (error) => {
      showError(error);
    },
  });

  const deleteProviderMutation = useMutation({
    mutationFn: async (providerId: string): Promise<void> => {
      if (!providerId) {
        throw new NextBillionError(
          "Provider ID is required",
          NextBillionErrorKind.Validation,
        );
      }

      return ipc.languageModel.deleteCustomProvider({ providerId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.languageModels.providers,
      });
    },
    onError: (error) => {
      showError(error);
    },
  });

  const createProvider = async (
    params: CreateCustomLanguageModelProviderParams,
  ): Promise<LanguageModelProvider> => {
    return createProviderMutation.mutateAsync(params);
  };

  const editProvider = async (
    params: CreateCustomLanguageModelProviderParams,
  ): Promise<LanguageModelProvider> => {
    return editProviderMutation.mutateAsync(params);
  };

  const deleteProvider = async (providerId: string): Promise<void> => {
    return deleteProviderMutation.mutateAsync(providerId);
  };

  return {
    createProvider,
    editProvider,
    deleteProvider,
    isCreating: createProviderMutation.isPending,
    isEditing: editProviderMutation.isPending,
    isDeleting: deleteProviderMutation.isPending,
    error:
      createProviderMutation.error ||
      editProviderMutation.error ||
      deleteProviderMutation.error,
  };
}
