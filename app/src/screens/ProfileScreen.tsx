import { ScrollView, View, Text, Image, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ route }: Props) {
  const { user } = route.params;

  const cursus =
    user.cursus_users.find((c) => c.cursus.kind === "main") ??
    user.cursus_users.find((c) => c.cursus.kind === "piscine") ??
    user.cursus_users[0];
  const finishedProjects = user.projects_users.filter(
    (p) => p.status === "finished",
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user.image?.link && (
        <Image source={{ uri: user.image.link }} style={styles.avatar} />
      )}

      <Text style={styles.login}>{user.login}</Text>

      <View style={styles.section}>
        <DetailRow label="Email" value={user.email} />
        <DetailRow label="Mobile" value={user.phone} />
        <DetailRow
          label="Level"
          value={cursus ? cursus.level.toFixed(2) : "N/A"}
        />
        <DetailRow label="Campus Seat" value={user.location ?? "Offline"} />
        <DetailRow label="Wallet" value={`${user.wallet} ₳`} />
        <DetailRow
          label="Evaluation points"
          value={String(user.correction_point)}
        />
      </View>

      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.section}>
        {cursus && cursus.skills.length > 0 ? (
          cursus.skills.map((skill) => {
            const level = Math.floor(skill.level);
            const percentage = Math.round((skill.level % 1) * 100);
            return (
              <View key={skill.id} style={styles.skillRow}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillLevel}>
                    Level {level} · {percentage}%
                  </Text>
                </View>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: `${percentage}%` }]} />
                </View>
              </View>
            );
          })
        ) : (
          <Text>No skills yet</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Projects</Text>
      <View style={styles.section}>
        {finishedProjects.length > 0 ? (
          finishedProjects.map((p) => (
            <DetailRow
              key={p.id}
              label={p.project.name}
              value={p["validated?"] ? "Passed" : "Failed"}
            />
          ))
        ) : (
          <Text>No completed projects yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  login: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  section: { width: "100%", marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  detailLabel: { fontWeight: "600" },
  detailValue: { flexShrink: 1, textAlign: "right" },
  skillRow: { marginBottom: 12, width: "100%" },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  skillName: { fontWeight: "600", flexShrink: 1 },
  skillLevel: { color: "#555" },
  barBackground: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: 6, backgroundColor: "#3498db" },
});
