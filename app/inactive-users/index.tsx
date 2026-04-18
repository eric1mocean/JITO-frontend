import { api_route } from "@/constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

type UserDto = {
  id: number;
  username: string;
  email: string;
  createDate: string;
  active: boolean;
};

type LoggedUser = {
  userId: number;
};

export default function AdminInactiveUsersScreen() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        const parsed: { id: number } = JSON.parse(userData);
        setLoggedUser({ userId: parsed.id });
      }
    } catch (e) {
      console.log("Error loading user");
    }
  };

  const fetchInactiveUsers = async () => {
    if (!loggedUser) return;

    try {
      setLoading(true);

      const response = await axios.get<UserDto[]>(
        `${api_route}/getAllInactiveUsers/${loggedUser.userId}`
      );

      setUsers(response.data);
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (loggedUser) {
      fetchInactiveUsers();
    }
  }, [loggedUser]);

  const renderItem = ({ item }: { item: UserDto }) => (
    <View style={styles.card}>
      <Text style={styles.username}>{item.username}</Text>
      <Text>{item.email}</Text>
      <Text>{item.createDate}</Text>
      <Text style={{ color: item.active ? "green" : "red" }}>
        {item.active ? "Active" : "Inactive"}
      </Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!users.length) {
    return (
      <View style={styles.center}>
        <Text>No inactive users</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  center: {
    marginTop: 40,
    alignItems: "center",
  },
});