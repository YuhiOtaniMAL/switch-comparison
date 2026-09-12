import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { getUserByLogin, NotFoundError, NetworkError } from "../api/client";

type Props = NativeStackScreenProps<RootStackParamList, "Search">;

export default function SearchScreen({ navigation }: Props) {
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (loading) return;
    const trimmed = login.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const user = await getUserByLogin(trimmed);
      navigation.navigate("Profile", { user });
    } catch (err) {
      if (err instanceof NotFoundError) {
        setError(`No user found for login "${trimmed}"`);
      } else if (err instanceof NetworkError) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swifty Companion</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a 42 login"
        autoCapitalize="none"
        autoCorrect={false}
        value={login}
        onChangeText={setLogin}
        onSubmitEditing={handleSearch}
      />
      <Button
        title="Search"
        onPress={handleSearch}
        disabled={loading || !login.trim()}
      />
      {loading && <ActivityIndicator style={styles.spinner} />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  spinner: { marginTop: 16 },
  error: { marginTop: 16, color: "#c0392b", textAlign: "center" },
});
