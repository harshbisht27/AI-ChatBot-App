import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import getGeminiResponse from "../Services/GlobalApi";

export default function ChatScreen() {
  const param = useRoute().params;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChatFace, setSelectedChatFace] = useState({});

  useEffect(() => {
    setSelectedChatFace(param.selectedFace);
    setMessages([
      {
        _id: 1,
        text: `Hello, I am ${param.selectedFace?.name || "your assistant"}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: param.selectedFace?.name,
          avatar: param.selectedFace?.image,
        },
      },
    ]);
  }, [param.selectedFace]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Image
          source={{ uri: selectedChatFace?.image }}
          style={styles.headerAvatar}
        />
        <Text style={styles.headerTitle}>{selectedChatFace?.name}</Text>
      </View>
      <View style={styles.placeholder} />
    </View>
  );

  const renderAvatar = (props) => {
    return (
      <Image style={styles.avatar} source={{ uri: selectedChatFace?.image }} />
    );
  };

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    setLoading(true);
    if (newMessages[0]?.text) {
      fetchGeminiResponse(newMessages[0].text);
    }
  }, []);

  const fetchGeminiResponse = async (userMsg) => {
    try {
      const response = await getGeminiResponse(userMsg);
      const geminiReply =
        response.data?.contents[0]?.parts[0]?.text ||
        "Sorry 🙏 No data found 😢";
      const chatAPIResp = {
        _id: Date.now(),
        text: geminiReply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Gemini Assistant",
          avatar: selectedChatFace?.image,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatAPIResp)
      );
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      const errorResp = {
        _id: Date.now(),
        text: "Oops! Something went wrong. Please try again later.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Gemini Assistant",
          avatar: selectedChatFace?.image,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, errorResp)
      );
    } finally {
      setLoading(false);
    }
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: selectedChatFace?.primary,
          },
          left: {
            backgroundColor: "#f0f0f0",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
          left: {
            color: "#000",
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={24} color={selectedChatFace?.primary} />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#fff",
          borderTopColor: "#E8E8E8",
          borderTopWidth: 1,
        }}
        textInputStyle={{
          color: "#000",
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <GiftedChat
        messages={messages}
        isTyping={loading}
        onSend={onSend}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderAvatar={renderAvatar}
        showAvatarForEveryMessage={true}
        alwaysShowSend
        scrollToBottom
        placeholder="Type your message here..."
        timeTextStyle={{
          right: { color: "#fff" },
          left: { color: "#666" },
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  backButton: {
    padding: 10,
  },
  placeholder: {
    width: 44, // Same width as backButton for symmetry
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
  },
});
