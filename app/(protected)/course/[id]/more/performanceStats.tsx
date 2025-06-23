import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Platform, FlatList, Alert } from "react-native";
import { Text, Card, Button, ActivityIndicator, IconButton, Menu, Divider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { captureRef } from "react-native-view-shot";
import { LineChart } from "react-native-chart-kit";
import {colors} from "@theme/colors";
import { getCoursePerformanceStats, getStudentPerformanceStats } from "@services/PerformanceStatsService";
import { getAcceptedMembers } from "@services/EnrollmentService";
import { useCourse } from "@context/CourseContext";

const screenWidth = Dimensions.get("window").width;

const MAX_GRAPH_POINTS = 10;

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

  const STUDENTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(students.length / STUDENTS_PER_PAGE);
  const paginatedStudents = students.slice(
    currentPage * STUDENTS_PER_PAGE,
    (currentPage + 1) * STUDENTS_PER_PAGE
  );

  const [graphPage, setGraphPage] = useState(0);
  const graphTotalPages = courseStats
    ? Math.ceil(courseStats.performanceTrend.length / MAX_GRAPH_POINTS)
    : 1;

  const chartRef = useRef<View>(null);

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
      fromDate ? fromDate.toISOString().slice(0, 19) : undefined,
      toDate ? toDate.toISOString().slice(0, 19) : undefined
    )
      .then((stats) => {
        setCourseStats(stats);
        setGraphPage(0); // Reinicia la paginación del gráfico al cambiar datos
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
      fromDate ? fromDate.toISOString().slice(0, 19) : undefined,
      toDate ? toDate.toISOString().slice(0, 19) : undefined
    )
      .then(setStudentStats)
      .catch(() => setStudentStats(null))
      .finally(() => setLoadingStudent(false));
  }, [courseId, selectedStudentId, fromDate, toDate]);

  const handleExportPDF = async () => {
    if (!courseStats) {
      Alert.alert("No data", "No course statistics available to export.");
      return;
    }

    try {
      const chartImages: string[] = [];
      for (let page = 0; page < graphTotalPages; page++) {
        setGraphPage(page);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 600));
        // eslint-disable-next-line no-await-in-loop
        const chartUri = await captureRef(chartRef, {
          format: "png",
          quality: 1,
        });
        // eslint-disable-next-line no-await-in-loop
        const chartBase64 = await FileSystem.readAsStringAsync(chartUri, { encoding: FileSystem.EncodingType.Base64 });
        chartImages.push(chartBase64);
      }
      setGraphPage(0); 

      const trendPages = [];
      for (let page = 0; page < graphTotalPages; page++) {
        const start = page * MAX_GRAPH_POINTS;
        const end = start + MAX_GRAPH_POINTS;
        const trendSlice = courseStats.performanceTrend.slice(start, end);
        const trendRows = trendSlice
          .map(
            (t) => `
            <tr>
              <td>${new Date(t.date).toLocaleDateString()}</td>
              <td>${t.label}</td>
              <td>${t.completionRate?.toFixed(2)}%</td>
              <td>${t.average?.toFixed(2)}</td>
            </tr>
          `
          )
          .join("");
        trendPages.push(trendRows);
      }

      let html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #222; background: #f7fafd; }
              h2 { color: ${colors.primary}; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
              th, td { border: 1px solid #b0b0b0; padding: 8px 10px; text-align: left; }
              th { background: #eaf1fb; color: ${colors.primary}; }
              .section-title { margin-top: 32px; margin-bottom: 8px; color: ${colors.secondary}; font-size: 18px; }
              .summary-box { background: #eaf1fb; border-radius: 10px; padding: 10px 18px; margin-bottom: 18px; display: inline-block; }
              .page-break { page-break-after: always; }
            </style>
          </head>
          <body>
            <h2>Student Performance Statistics</h2>
            <div class="section-title">Global Overview</div>
            <div class="summary-box">
              <b>Average Score:</b> ${courseStats.averageScore?.toFixed(2)}<br/>
              <b>Completion Rate:</b> ${courseStats.completionRate?.toFixed(2)}%
            </div>
      `;

      for (let i = 0; i < chartImages.length; i++) {
        html += `
          <div class="section-title">Performance Trend Chart (${i + 1} / ${chartImages.length})</div>
          <img src="data:image/png;base64,${chartImages[i]}" style="width:100%;max-width:600px;border-radius:12px;border:2px solid ${colors.primary};background:#fff;" />
          <div class="section-title">Performance Trend Data (${i + 1} / ${chartImages.length})</div>
          <table>
            <tr>
              <th>Date</th>
              <th>Evaluation</th>
              <th>Completion Rate</th>
              <th>Average Score</th>
            </tr>
            ${trendPages[i]}
          </table>
          ${i < chartImages.length - 1 ? '<div class="page-break"></div>' : ""}
        `;
      }

      html += `
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Export failed", "There was an error exporting the PDF.");
      console.error(err);
    }
  };

  const formatDate = (date?: Date | null) =>
    date ? date.toLocaleDateString() : "Select date";

  const formatNumber = (num?: number | null) => {
    if (typeof num !== "number" || isNaN(num)) return "-";
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

  const getStudentChartData = (trend: PerformanceTrendItem[] = []) => ({
    labels: trend.map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        data: trend.map((t) => t.average),
        color: () => colors.primary,
        strokeWidth: 3,
      },
    ],
    legend: ["Average Score"],
  });

  const getPagedTrend = () => {
    if (!courseStats) return [];
    const start = graphPage * MAX_GRAPH_POINTS;
    const end = start + MAX_GRAPH_POINTS;
    return courseStats.performanceTrend.slice(start, end);
  };

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
          <Menu.Item onPress={() => { handleExportPDF(); setMenuVisible(false); }} title="Export as PDF" />
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
                  {formatNumber(courseStats.completionRate)}%
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

      {/* Performance Trend Chart paginado */}
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
                <View ref={chartRef} collapsable={false}>
                  <LineChart
                    data={getChartData(getPagedTrend())}
                    width={Math.max(screenWidth - 48, 90 * (getPagedTrend()?.length || 1))}
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
                </View>
              </ScrollView>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 8 }}>
                <Button
                  mode="text"
                  disabled={graphPage === 0}
                  onPress={() => setGraphPage((p) => Math.max(0, p - 1))}
                >
                  {"<"}
                </Button>
                <Text style={{ marginHorizontal: 8 }}>
                  {graphPage + 1} / {graphTotalPages}
                </Text>
                <Button
                  mode="text"
                  disabled={graphPage >= graphTotalPages - 1}
                  onPress={() => setGraphPage((p) => Math.min(graphTotalPages - 1, p + 1))}
                >
                  {">"}
                </Button>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={[
                  styles.chartLabelsRow,
                  { paddingLeft: 30, paddingRight: 30 },
                ]}
                showsHorizontalScrollIndicator={false}
              >
                {getPagedTrend()?.map((t, idx) => (
                  <View key={idx} style={styles.chartLabelBox}>
                    <Text style={styles.chartLabelDate}>
                      {new Date(t.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.chartLabelEval}>{t.label}</Text>
                    <Text style={styles.chartLabelCompletion}>
                      {formatNumber(t.completionRate)}% completed
                    </Text>
                    <Text style={styles.chartLabelAvgScore}>
                      Avg: {formatNumber(t.average)}
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
              {/* PAGINADOR HORIZONTAL DE ESTUDIANTES */}
              <View style={{ marginVertical: 10 }}>
                <FlatList
                  data={paginatedStudents}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Button
                      key={item.id}
                      mode={selectedStudentId === item.id ? "contained" : "outlined"}
                      onPress={() => setSelectedStudentId(item.id)}
                      style={[
                        styles.studentBtnColumn,
                        selectedStudentId === item.id && styles.studentBtnSelected,
                      ]}
                      labelStyle={[
                        styles.studentBtnLabel,
                        selectedStudentId === item.id && styles.studentBtnLabelSelected,
                      ]}
                      contentStyle={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
                    </Button>
                  )}
                  ListFooterComponent={
                    totalPages > 1 ? (
                      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
                        <Button
                          mode="text"
                          disabled={currentPage === 0}
                          onPress={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        >
                          {"<"}
                        </Button>
                        <Text style={{ marginHorizontal: 8 }}>
                          {currentPage + 1} / {totalPages}
                        </Text>
                        <Button
                          mode="text"
                          disabled={currentPage >= totalPages - 1}
                          onPress={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        >
                          {">"}
                        </Button>
                      </View>
                    ) : null
                  }
                />
              </View>
              {/* FIN PAGINADOR */}

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
                                {g.completionRate >= 100 ? "Completed" : "Not completed"}
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
                            data={getStudentChartData(studentStats.performanceTrend)}
                            width={Math.max(screenWidth - 48, 90 * (studentStats.performanceTrend?.length || 1))}
                            height={180}
                            yAxisSuffix=""
                            yAxisInterval={1}
                            chartConfig={{
                              backgroundColor: colors.cardBackground,
                              backgroundGradientFrom: colors.cardBackground,
                              backgroundGradientTo: colors.cardBackground,
                              decimalPlaces: 2,
                              color: (opacity = 1) => colors.primary,
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
  chartLabelAvgScore: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 1,
    fontWeight: "bold",
  },
  studentsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
    marginTop: 2,
  },
  studentsListColumn: {
    flexDirection: "column",
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
  studentBtnColumn: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.inputBackground,
    borderColor: colors.primary,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 8,
    marginRight: 8,
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
  gradeCompletion: {
    fontSize: 11,
    color: colors.secondary,
    marginTop: 1,
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