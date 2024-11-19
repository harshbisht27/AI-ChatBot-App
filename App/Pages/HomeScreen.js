import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import ChatFaceData from "../Services/ChatFaceData";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [selectedFace, setSelectedFace] = useState(ChatFaceData[0]);
  const navigation = useNavigation();

  const renderChatFace = ({ item }) =>
    selectedFace.id !== item.id && (
      <TouchableOpacity onPress={() => setSelectedFace(item)}>
        <Image
          source={{ uri: item.image }}
          style={[styles.avatarImage, { borderColor: item.primary }]}
        />
      </TouchableOpacity>
    );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: selectedFace.primary }]}>
            Hello, I am {selectedFace.name}
          </Text>
          <Image
            source={{ uri: selectedFace.image }}
            style={styles.mainImage}
          />
          <Text style={[styles.subtitle, { color: selectedFace.primary }]}>
            How can I help you?
          </Text>
        </View>

        <View style={styles.chatbots}>
          <FlatList
            data={ChatFaceData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderChatFace}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        <Text style={styles.hint}>Choose your Favourite ChatBuddy 🤟</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("chat", { selectedFace })}
          style={[styles.chatButton, { backgroundColor: selectedFace.primary }]}
        >
          <Text style={styles.buttonText}>Let's chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: -40,
  },
  header: {
    alignItems: "center",
    width: "100%",
  },
  greeting: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 25,
    marginTop: 20,
  },
  mainImage: {
    marginTop: 20,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  avatarImage: {
    width: 50,
    height: 50,
    margin: 10,
    borderRadius: 25,
    borderWidth: 2,
  },
  chatbots: {
    marginTop: 20,
    alignItems: "center",
    height: 95,
    padding: 10,
    borderRadius: 15,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  hint: {
    marginTop: 5,
    fontSize: 17,
    color: "#B0B0B0",
  },
  chatButton: {
    padding: 17,
    width: Dimensions.get("screen").width * 0.6,
    borderRadius: 19,
    alignItems: "center",
    marginTop: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 19,
    color: "#fff",
    fontWeight: "bold",
  },
});
