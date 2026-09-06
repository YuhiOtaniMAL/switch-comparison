import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Skill = {
  name: string;
  level: number;
};

type ProjectUser = {
  final_mark: number | null;
  status: string;
  validated?: boolean | null;
  project: {
    name: string;
  };
};

type CursusUser = {
  level: number;
  skills: Skill[];
};

type IntraUser = {
  login: string;
  email: string;
  phone: string | null;
  location: string | null;
  wallet: number;
  correction_point: number;
  image: {
    link: string;
  };
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
};

let cachedAccessToken: string | null = null;

const getAccessToken = async () => {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const clientId = process.env.EXPO_PUBLIC_UID;
  const clientSecret = process.env.EXPO_PUBLIC_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing API credentials. Set EXPO_PUBLIC_UID and EXPO_PUBLIC_SECRET in your local .env file.');
  }

  const response = await fetch('https://api.intra.42.fr/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve OAuth token.');
  }

  const data = await response.json() as { access_token: string };
  cachedAccessToken = data.access_token;

  return cachedAccessToken;
};

const fetchUser = async (login: string) => {
  const token = await getAccessToken();
  const response = await fetch(`https://api.intra.42.fr/v2/users/${encodeURIComponent(login)}`, {
    headers: { Authorization: 'Bearer ' + token },
  });

  if (response.status === 404) {
    throw new Error('Login not found.');
  }

  if (!response.ok) {
    throw new Error('Network or API error. Please try again.');
  }

  return response.json() as Promise<IntraUser>;
};

export default function App() {
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<IntraUser | null>(null);

  const selectedCursus = useMemo(() => user?.cursus_users.find((cursus) => cursus.skills.length > 0), [user]);
  const completedProjects = useMemo(
    () => user?.projects_users.filter((project) => project.status === 'finished') ?? [],
    [user],
  );

  const handleSearch = async () => {
    const trimmedLogin = login.trim();

    if (!trimmedLogin) {
      setErrorMessage('Please enter a login.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const fetchedUser = await fetchUser(trimmedLogin);
      setUser(fetchedUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error occurred.';
      setErrorMessage(message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!user ? (
        <View style={styles.container}>
          <Text style={styles.title}>Swifty Companion</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Enter 42 login"
            value={login}
            onChangeText={setLogin}
          />
          <Pressable style={styles.button} onPress={handleSearch} disabled={loading}>
            <Text style={styles.buttonLabel}>{loading ? 'Searching...' : 'Search'}</Text>
          </Pressable>
          {loading && <ActivityIndicator size="small" color="#0b69ff" />}
          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={{ uri: user.image.link }} style={styles.avatar} />
          <Text style={styles.detail}>Login: {user.login}</Text>
          <Text style={styles.detail}>Email: {user.email}</Text>
          <Text style={styles.detail}>Mobile: {user.phone || 'N/A'}</Text>
          <Text style={styles.detail}>Level: {selectedCursus?.level.toFixed(2) ?? 'N/A'}</Text>
          <Text style={styles.detail}>Location: {user.location || 'Unavailable'}</Text>
          <Text style={styles.detail}>Wallet: {user.wallet}</Text>
          <Text style={styles.detail}>Evaluations: {user.correction_point}</Text>

          <Text style={styles.sectionTitle}>Skills</Text>
          {selectedCursus?.skills.length ? (
            selectedCursus.skills.map((skill) => (
              <Text key={skill.name} style={styles.listItem}>
                {skill.name}: {skill.level.toFixed(2)} ({Math.min((skill.level / 20) * 100, 100).toFixed(1)}%)
              </Text>
            ))
          ) : (
            <Text style={styles.listItem}>No skills available.</Text>
          )}

          <Text style={styles.sectionTitle}>Completed Projects (including failed)</Text>
          {completedProjects.length ? (
            completedProjects.map((project) => {
              const passed = project.validated ?? (project.final_mark ?? 0) >= 50;
              return (
                <Text key={project.project.name} style={styles.listItem}>
                  {project.project.name}: {project.final_mark ?? 'N/A'} - {passed ? 'Passed' : 'Failed'}
                </Text>
              );
            })
          ) : (
            <Text style={styles.listItem}>No completed projects.</Text>
          )}

          <Pressable style={styles.button} onPress={() => setUser(null)}>
            <Text style={styles.buttonLabel}>Back</Text>
          </Pressable>
        </ScrollView>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0b69ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#d20000',
    textAlign: 'center',
    marginTop: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
  },
  listItem: {
    fontSize: 15,
  },
});
