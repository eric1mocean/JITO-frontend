import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

interface User {
  
  id: string
  username: string;
  email: string;
  role: string;
}

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (e) {
      console.error('Failed to load user from storage:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={styles.greeting}>
      Hello, {user?.username}
    </Text>
      {
        user?.role == "teamleader" ? 
        <>
          <Button title="View tasks" onPress={() => router.push("/view-tasks")}  />
          <Button title="Create task" onPress={() => router.push("/create-task")} />
          <Button title="Assign task" onPress={() => router.push("/assign-task")} />
        </>
        : user?.role == "admin" ?
        <>
          <Button title="View tasks" onPress={() => router.push("/view-tasks")}  />
        </>
        : <Button title="User tasks" onPress={() => router.push("/user-tasks")}  />
      }
      
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  center: {
    
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  linkText: {
  marginTop: 16,
  color: '#007bff',
  textAlign: 'center',
  },
});