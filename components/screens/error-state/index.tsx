import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, View } from "react-native";
import { styles } from "./styles";

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
  onResetFilters?: () => void;
  showResetFilters?: boolean;
}

export function ErrorState({
  error,
  onRetry,
  title,
  description,
  showDetails = false,
  onResetFilters,
  showResetFilters = false,
}: ErrorStateProps) {
  const { t } = useTranslation();

  const getErrorInfo = () => {
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number };
      const status = apiError.status;

      if (status === 404) {
        return {
          icon: "search-outline" as const,
          title: title || t("errors.notFound.title"),
          description: description || t("errors.notFound.description"),
          type: "notFound" as const,
        };
      } else if (status === 401 || status === 403) {
        return {
          icon: "lock-closed-outline" as const,
          title: title || t("errors.unauthorized.title"),
          description: description || t("errors.unauthorized.description"),
          type: "unauthorized" as const,
        };
      } else if (status >= 500) {
        return {
          icon: "server-outline" as const,
          title: title || t("errors.server.title"),
          description: description || t("errors.server.description"),
          type: "server" as const,
        };
      } else if (status === 0 || !status) {
        return {
          icon: "wifi-outline" as const,
          title: title || t("errors.network.title"),
          description: description || t("errors.network.description"),
          type: "network" as const,
        };
      }
    }

    return {
      icon: "alert-circle-outline" as const,
      title: title || t("errors.generic.title"),
      description: description || t("errors.generic.description"),
      type: "generic" as const,
    };
  };

  const errorInfo = getErrorInfo();

  const handleShowDetails = () => {
    if (showDetails && error) {
      Alert.alert(t("errors.details.title"), String(error), [
        { text: t("common.close") },
      ]);
    }
  };

  return (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={errorInfo.icon}
          size={64}
          color="rgba(127,127,127,0.6)"
        />
      </View>

      <ThemedText type="title" style={styles.title}>
        {errorInfo.title}
      </ThemedText>

      <ThemedText style={styles.description}>
        {errorInfo.description}
      </ThemedText>

      {showDetails && Boolean(error) && (
        <Pressable onPress={handleShowDetails} style={styles.detailsBtn}>
          <ThemedText type="defaultSemiBold" style={styles.detailsText}>
            {t("errors.details.show")}
          </ThemedText>
        </Pressable>
      )}

      {showResetFilters && onResetFilters && (
        <Pressable onPress={onResetFilters} style={styles.resetFiltersBtn}>
          <Ionicons
            name="refresh-outline"
            size={20}
            color="#007AFF"
            style={styles.resetFiltersIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.resetFiltersText}>
            {t("common.clearFilters")}
          </ThemedText>
        </Pressable>
      )}

      <Pressable onPress={onRetry} style={styles.retryBtn}>
        <Ionicons
          name="refresh"
          size={20}
          color="white"
          style={styles.retryIcon}
        />
        <ThemedText type="defaultSemiBold" style={styles.retryText}>
          {t("common.retry")}
        </ThemedText>
      </Pressable>
    </View>
  );
}
