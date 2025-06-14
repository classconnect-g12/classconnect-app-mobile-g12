import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Platform, ActivityIndicator } from "react-native";
import { Text, Card, Button, Menu, Divider, IconButton } from "react-native-paper";
import { colors } from "@theme/colors";
import { LineChart } from "react-native-chart-kit";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getCoursePerformanceStats, getStudentPerformanceStats } from "@services/PerformanceStatsService";
import { getAcceptedMembers } from "@services/EnrollmentService";
import { useCourse } from "@context/CourseContext";

const screenWidth = Dimensions.get("window").width;

type PerformanceTrendItem = {
  label: string;
  average: number;
  date: string;
  completionRate: number;
};

type CoursePerformanceStats = {
  averageScore: number;
  completionRate: number;
  performanceTrend: PerformanceTrendItem[];
};

type StudentPerformanceStats = {
  averageScore: number;
  completionRate: number;
  performanceTrend: PerformanceTrendItem[];
};

type Student = {
  id: number | string;
  name: string;
};

export default function PerformanceStatsScreen() {
  const { courseId } = useCourse();
  const [menuVisible, setMenuVisible] = useState(false);

  // Date filters
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Data state
  const [loading, setLoading] = useState(true);
  const [courseStats, setCourseStats] = useState<CoursePerformanceStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | string | null>(null);
  const [studentStats, setStudentStats] = useState<StudentPerformanceStats | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await getAcceptedMembers(courseId, 0, 1000);
        const studentsList: Student[] =
          res.enrollments
            ?.filter((m: any) => m.createdByRole === "STUDENT" && m.userProfile?.user_name?.trim())
            .map((m: any) => ({
              id: m.userProfile.id,
              name:
                [m.userProfile.first_name, m.userProfile.last_name]
                  .filter(Boolean)
                  .join(" ")
                  .trim() || m.userProfile.user_name,
            })) || [];
        setStudents(studentsList);
      } catch (e) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    getCoursePerformanceStats(
      courseId,
      fromDate ? fromDate.toISOString().slice(0, 10) : undefined,
      toDate ? toDate.toISOString().slice(0, 10) : undefined
    )
      .then((stats) => {
        setCourseStats(stats);
      })
      .catch(() => setCourseStats(null))
      .finally(() => setLoading(false));
  }, [courseId, fromDate, toDate]);

  useEffect(() => {
    if (!courseId || !selectedStudentId) {
      setStudentStats(null);
      return;
    }
    setLoadingStudent(true);
    getStudentPerformanceStats(
      courseId,
      selectedStudentId,
      fromDate ? fromDate.toISOString().slice(0, 10) : undefined,
      toDate ? toDate.toISOString().slice(0, 10) : undefined
    )
      .then(setStudentStats)
      .catch(() => setStudentStats(null))
      .finally(() => setLoadingStudent(false));
  }, [courseId, selectedStudentId, fromDate, toDate]);

  // TODO Export functionality
  const handleExport = async (type: "pdf" | "excel") => {
    const fileUri = FileSystem.documentDirectory + `stats.${type}`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(courseStats));
  };

  const formatDate = (date?: Date | null) =>
    date ? date.toLocaleDateString() : "Select date";

  const formatNumber = (num?: number | null) => {
    if (typeof num !== "number" || isNaN(num)) return "-";
    return num.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getChartData = (trend: PerformanceTrendItem[] = []) => ({
    labels: trend.map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        data: trend.map((t) => t.average),
        color: () => colors.primary,
        strokeWidth: 3,
      },
      {
        data: trend.map((t) => t.completionRate),
        color: () => colors.secondary,
        strokeWidth: 2,
      },
    ],
    legend: ["Average Score", "Completion Rate (%)"],
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Performance Statistics</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="export"
              size={26}
              onPress={() => setMenuVisible(true)}
              style={{ marginLeft: 8 }}
              accessibilityLabel="Export"
              iconColor={colors.primary}
            />
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item onPress={() => handleExport("pdf")} title="Export as PDF" />
          <Menu.Item onPress={() => handleExport("excel")} title="Export as Excel" />
        </Menu>
      </View>

      {/* Global indicators */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Global Overview</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
          ) : !courseStats ? (
            <Text style={{ color: colors.textMuted, marginVertical: 16 }}>
              No data available for this course.
            </Text>
          ) : (
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Average Score</Text>
                <Text style={styles.statValue}>
                  {formatNumber(courseStats.averageScore)}
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Completion Rate</Text>
                <Text style={styles.statValue}>
                  {typeof courseStats.completionRate === "number"
                    ? `${formatNumber(courseStats.completionRate)}%`
                    : "-"}
                </Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Date Filters */}
      <View style={styles.filters}>
        <Button
          mode="outlined"
          style={styles.filterBtn}
          labelStyle={styles.filterLabel}
          onPress={() => setShowFromPicker(true)}
        >
          From: {formatDate(fromDate)}
        </Button>
        <Button
          mode="outlined"
          style={styles.filterBtn}
          labelStyle={styles.filterLabel}
          onPress={() => setShowToPicker(true)}
        >
          To: {formatDate(toDate)}
        </Button>
      </View>
      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(_, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
          maximumDate={toDate || undefined}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(_, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
          minimumDate={fromDate || undefined}
        />
      )}

      {/* Performance Trend Chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Performance Trend</Text>
          <Text style={styles.chartDescription}>
            Average score and completion rate per evaluation date
          </Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
          ) : !courseStats || !courseStats.performanceTrend?.length ? (
            <Text style={{ color: colors.textMuted, marginVertical: 16 }}>
              No evaluations found for this course.
            </Text>
          ) : (
            <>
              <ScrollView horizontal contentContainerStyle={{ paddingLeft: 18, paddingRight: 18 }}>
                <LineChart
                  data={getChartData(courseStats.performanceTrend)}
                  width={Math.max(screenWidth - 48, 90 * (courseStats.performanceTrend?.length || 1))}
                  height={210}
                  yAxisSuffix=""
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: colors.cardBackground,
                    backgroundGradientFrom: colors.cardBackground,
                    backgroundGradientTo: colors.cardBackground,
                    decimalPlaces: 2,
                    color: (opacity = 1, idx?: number) =>
                      idx === 1 ? colors.secondary : colors.primary,
                    labelColor: (opacity = 1) => colors.text,
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: colors.secondary,
                    },
                    propsForBackgroundLines: {
                      stroke: colors.inputBackground,
                    },
                  }}
                  bezier
                  style={{
                    borderRadius: 14,
                    marginVertical: 8,
                    marginLeft: 12,
                    marginRight: 12,
                  }}
                  formatYLabel={(y) =>
                    typeof y === "string"
                      ? formatNumber(Number(y))
                      : formatNumber(y)
                  }
                  fromZero
                  segments={5}
                  withInnerLines
                  withOuterLines
                  withVerticalLabels
                />
              </ScrollView>
              <ScrollView
                horizontal
                contentContainerStyle={[
                  styles.chartLabelsRow,
                  { paddingLeft: 30, paddingRight: 30 },
                ]}
                showsHorizontalScrollIndicator={false}
              >
                {courseStats.performanceTrend?.map((t, idx) => (
                  <View key={idx} style={styles.chartLabelBox}>
                    <Text style={styles.chartLabelDate}>
                      {new Date(t.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.chartLabelEval}>{t.label}</Text>
                    <Text style={styles.chartLabelCompletion}>
                      {formatNumber(t.completionRate)}% completed
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Student Breakdown */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Student Breakdown</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
          ) : !students.length ? (
            <Text style={{ color: colors.textMuted, marginVertical: 16 }}>
              No students found for this course.
            </Text>
          ) : (
            <>
              <View style={styles.studentsList}>
                {students.map((student) => (
                  <Button
                    key={student.id}
                    mode={selectedStudentId === student.id ? "contained" : "outlined"}
                    onPress={() => setSelectedStudentId(student.id)}
                    style={[
                      styles.studentBtn,
                      selectedStudentId === student.id && styles.studentBtnSelected,
                    ]}
                    labelStyle={[
                      styles.studentBtnLabel,
                      selectedStudentId === student.id && styles.studentBtnLabelSelected,
                    ]}
                  >
                    {student.name}
                  </Button>
                ))}
              </View>
              {selectedStudentId && (
                <View style={styles.studentDetail}>
                  {loadingStudent ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
                  ) : !studentStats ? (
                    <Text style={{ color: colors.textMuted, marginVertical: 16 }}>
                      No performance data found for this student.
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.bold}>
                        {students.find((s) => s.id === selectedStudentId)?.name}
                      </Text>
                      <Text style={styles.detailRow}>
                        <Text style={styles.bold}>Average Score:</Text> {formatNumber(studentStats.averageScore)}
                      </Text>
                      <Text style={styles.detailRow}>
                        <Text style={styles.bold}>Completion Rate:</Text> {formatNumber(studentStats.completionRate)}%
                      </Text>
                      <Divider style={{ marginVertical: 8 }} />
                      <Text style={styles.detailSectionTitle}>Evaluations:</Text>
                      {studentStats.performanceTrend.length === 0 ? (
                        <Text style={{ color: colors.textMuted, marginBottom: 8 }}>
                          No evaluations found for this student.
                        </Text>
                      ) : (
                        studentStats.performanceTrend.map((g, idx) => (
                          <View key={idx} style={styles.gradeDetailRow}>
                            <View style={{ flex: 2 }}>
                              <Text style={styles.gradeLabel}>{g.label}</Text>
                              <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                                {new Date(g.date).toLocaleDateString()}
                              </Text>
                            </View>
                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                              <Text style={styles.gradeScore}>Score: {formatNumber(g.average)}</Text>
                              <Text style={{ color: colors.secondary, fontSize: 11 }}>
                                {formatNumber(g.completionRate)}% completed
                              </Text>
                            </View>
                          </View>
                        ))
                      )}
                      <Divider style={{ marginVertical: 8 }} />
                      <View style={styles.detailSummaryRow}>
                        <View style={styles.detailSummaryBox}>
                          <Text style={styles.detailSummaryLabel}>Best Score</Text>
                          <Text style={styles.detailSummaryValue}>
                            {studentStats.performanceTrend.length
                              ? formatNumber(Math.max(...studentStats.performanceTrend.map((g) => g.average)))
                              : "-"}
                          </Text>
                        </View>
                        <View style={styles.detailSummaryBox}>
                          <Text style={styles.detailSummaryLabel}>Lowest Score</Text>
                          <Text style={styles.detailSummaryValue}>
                            {studentStats.performanceTrend.length
                              ? formatNumber(Math.min(...studentStats.performanceTrend.map((g) => g.average)))
                              : "-"}
                          </Text>
                        </View>
                        <View style={styles.detailSummaryBox}>
                          <Text style={styles.detailSummaryLabel}># Evaluations</Text>
                          <Text style={styles.detailSummaryValue}>
                            {studentStats.performanceTrend.length}
                          </Text>
                        </View>
                      </View>
                      {/* Student chart */}
                      <Divider style={{ marginVertical: 8 }} />
                      <Text style={styles.detailSectionTitle}>Trend</Text>
                      {studentStats.performanceTrend.length === 0 ? (
                        <Text style={{ color: colors.textMuted, marginBottom: 8 }}>
                          No evaluations to display.
                        </Text>
                      ) : (
                        <ScrollView horizontal contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}>
                          <LineChart
                            data={getChartData(studentStats.performanceTrend)}
                            width={Math.max(screenWidth - 48, 90 * (studentStats.performanceTrend?.length || 1))}
                            height={180}
                            yAxisSuffix=""
                            yAxisInterval={1}
                            chartConfig={{
                              backgroundColor: colors.cardBackground,
                              backgroundGradientFrom: colors.cardBackground,
                              backgroundGradientTo: colors.cardBackground,
                              decimalPlaces: 2,
                              color: (opacity = 1, idx?: number) =>
                                idx === 1 ? colors.secondary : colors.primary,
                              labelColor: (opacity = 1) => colors.text,
                              propsForDots: {
                                r: "5",
                                strokeWidth: "2",
                                stroke: colors.secondary,
                              },
                              propsForBackgroundLines: {
                                stroke: colors.inputBackground,
                              },
                            }}
                            bezier
                            style={{
                              borderRadius: 10,
                              marginVertical: 8,
                              marginLeft: 0,
                              marginRight: 0,
                            }}
                            formatYLabel={(y) =>
                              typeof y === "string"
                                ? formatNumber(Number(y))
                                : formatNumber(y)
                            }
                            fromZero
                            segments={4}
                            withInnerLines
                            withOuterLines
                            withVerticalLabels
                          />
                        </ScrollView>
                      )}
                    </>
                  )}
                </View>
              )}
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    paddingBottom: 0,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    flex: 1,
  },
  menuContent: {
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    minWidth: 170,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.primary + "22",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 2,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 2,
    gap: 8,
  },
  filterBtn: {
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    borderColor: colors.primary,
    borderWidth: 1,
    minWidth: 120,
    height: 38,
    justifyContent: "center",
  },
  filterLabel: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  chartDescription: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 2,
    marginLeft: 2,
  },
  chartLabelsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    marginTop: 6,
    marginBottom: 2,
    alignItems: "flex-start",
  },
  chartLabelBox: {
    alignItems: "center",
    minWidth: 90,
    maxWidth: 120,
    marginHorizontal: 4,
    paddingHorizontal: 2,
  },
  chartLabelDate: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "bold",
  },
  chartLabelEval: {
    fontSize: 11,
    color: colors.text,
    textAlign: "center",
    marginTop: 1,
  },
  chartLabelCompletion: {
    fontSize: 11,
    color: colors.secondary,
    marginTop: 1,
  },
  studentsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
    marginTop: 2,
  },
  studentBtn: {
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.inputBackground,
    borderColor: colors.primary,
    borderWidth: 1,
    minWidth: 120,
    height: 38,
    justifyContent: "center",
  },
  studentBtnSelected: {
    backgroundColor: colors.primary,
  },
  studentBtnLabel: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  studentBtnLabelSelected: {
    color: colors.buttonText,
  },
  studentDetail: {
    marginTop: 10,
    backgroundColor: "#f7fafd",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.inputBackground,
  },
  bold: {
    fontWeight: "bold",
    color: colors.primary,
  },
  gradeRow: {
    fontSize: 14,
    marginBottom: 2,
    color: colors.text,
  },
  detailRow: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  detailSectionTitle: {
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 4,
    marginTop: 2,
    fontSize: 15,
  },
  gradeDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 2,
    alignItems: "center",
  },
  gradeLabel: {
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
  },
  gradeScore: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "right",
  },
  detailSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 2,
  },
  detailSummaryBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    marginHorizontal: 2,
    paddingVertical: 6,
  },
  detailSummaryLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  detailSummaryValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
  },
});