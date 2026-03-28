import { api_route } from "@/constants/API";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { Divider, Menu, Provider } from "react-native-paper";

type user = {
  userId: number,
  userEmail: string,
  userName: string,
  userImage: string
}

type task = {
  id: number,
  title: string,
  description: string,
  deadline: string,
  status: string,
  severity: string
}

type taskWithUsersResponse = {
  users: user[],
  tasks: task[]
}
const AssignForm = () => {
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [selectedTask, setSelectedTask] = useState<{ id: number; title: string } | null>(null);

  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [users, setUsers] = useState<user[]>([])
  const [tasks, setTasks] = useState<task[]>([])

  const handleFetchedTasks = async () => {
    const response = await axios.get<taskWithUsersResponse>(`${api_route}/getUsersWithUnassignedTasks`)
    setUsers(response.data.users)
    setTasks(response.data.tasks)
  }
  useEffect(() => {
    handleFetchedTasks()

  }, [])


  const handleAssign = async () => {
    if (!selectedUser || !selectedTask) {
      Alert.alert("Eroare", "Selectează un user și un task.");
      return;
    }
    await axios.put(`${api_route}/assignTasks/${selectedUser.id}/${selectedTask.id}`)
    Alert.alert(
      "Succes",
      `Task-ul "${selectedTask.title}" a fost asignat către ${selectedUser.name}`
    );
    
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.label}>Selectează un User</Text>
        <Menu
          visible={userMenuVisible}
          onDismiss={() => setUserMenuVisible(false)}
          anchor={
            <Button
              title={selectedUser ? selectedUser.name : "Alege un user"}
              onPress={() => setUserMenuVisible(true)}
            />
          }
        >
          <ScrollView style={{ maxHeight: 200 }}>
          {users.map((user) => (
            <Menu.Item
              key={user.userId}
              onPress={() => {
                setSelectedUser({ id: user.userId, name: user.userName });
                setUserMenuVisible(false);
              }}
              title={user.userEmail}
            />
          ))}
          </ScrollView>
        </Menu>
        <Divider style={{ marginVertical: 20 }} /> 

        <Text style={styles.label}>Selectează un Task</Text>
        <Menu
          visible={taskMenuVisible}
          onDismiss={() => setTaskMenuVisible(false)}
          anchor={

          <Button
            title={selectedTask ? selectedTask.title : "Alege un task"}
            onPress={() => setTaskMenuVisible(true)}
        />
          }
        >
        <ScrollView style={{ maxHeight: 200 }}>
          {tasks.map((task) => (
            <Menu.Item
              key={task.id}
              onPress={() => {
                setSelectedTask({ id: task.id, title: task.title });
                setTaskMenuVisible(false);
              }}
              title={task.title}
            />
          ))}
        </ScrollView>
      </Menu>

      <Divider style={{ marginVertical: 20 }} />

      <Button
        title="Assign"
        onPress={handleAssign}
        color="#101113ff"
      />

    </View>
    </Provider >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 15,
  },
  dropdown: {
    justifyContent: "center",
    marginBottom: 10,
  },
});

export default AssignForm;