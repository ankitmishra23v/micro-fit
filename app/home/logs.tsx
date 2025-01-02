import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { getAllNotifications } from "@/services/utilities/api";
import { useAuth } from "@/auth/useAuth";
import { toast } from "@/components/ToastManager";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

const NotificationItem = React.memo(({ item }: { item: Notification }) => (
  <View className="p-3 mb-3 bg-primary rounded-lg">
    <Text className="text-lg text-white font-semibold mb-2">{item.title}</Text>
    <Text className="text-md text-secondary mb-2">{item.message}</Text>
    <Text className="text-xs text-secondary mt-2">
      {new Date(item.createdAt).toLocaleString()}
    </Text>
  </View>
));

const Logs = () => {
  const { id } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (currentPage: number) => {
    try {
      setLoading(true);
      const user_id = id as string;
      const params = { page: currentPage };
      const response: any = await getAllNotifications({ user_id, params });
      if (response.success) {
        setNotifications((prev) => [...prev, ...response.data]);
        setHasMore(currentPage < response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error({ title: error.error });
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => <NotificationItem item={item} />,
    []
  );

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  return (
    <SafeAreaView className="bg-black h-full">
      <TouchableOpacity
        onPress={() => router.back()}
        className="mb-4 mt-4 px-3"
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      <View className="flex-1 px-4">
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={3}
          removeClippedSubviews={true}
          ListFooterComponent={
            hasMore ? (
              <View className="my-4">
                {loading ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                  <TouchableOpacity
                    onPress={loadMore}
                    className="py-2 px-4 bg-primary rounded"
                  >
                    <Text className="text-center text-white">Load More</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text className="text-center text-sm text-gray-500 my-4">
                No more notifications
              </Text>
            )
          }
          contentContainerStyle={{ paddingBottom: 70 }} // Ensure space for the button
        />
      </View>
    </SafeAreaView>
  );
};

export default Logs;
