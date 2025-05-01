import React from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";
import { Card, Button } from "react-native-paper";
import { colors } from "@theme/colors";
import { findCourseStyles as styles } from "@styles/findCourseStyles";
import { ApiCourse } from "@src/types/course";
import { Router } from "expo-router";

interface CourseItemProps {
  item: ApiCourse;
  tab: "created" | "enrolled";
  router: Router;
}

const CourseItem: React.FC<CourseItemProps> = ({ item, tab, router }) => {
  const isLimitedCapacity = item.capacity <= 5;
  const now = new Date();
  const startDate = new Date(item.startDate);
  const daysUntilStart =
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  const isStartingSoon = daysUntilStart <= 3 && daysUntilStart >= 0;
  const hasStarted = startDate < now;

  const handlePress = () => {
    router.push(`/course/${item.id}`);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <Card style={styles.courseCard}>
          <Card.Content>
            <Text style={styles.courseName}>{item.title}</Text>
            <Text style={styles.courseDescription}>{item.description}</Text>
            <Text style={styles.courseDetails}>
              Starts: {new Date(item.startDate).toLocaleDateString()} | Ends:{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </Text>
            {isLimitedCapacity && (
              <Text style={styles.availabilityIndicator}>Cupos limitados</Text>
            )}
            {isStartingSoon && (
              <Text style={styles.availabilityIndicator}>
                Últimos días para inscribirse
              </Text>
            )}
            {hasStarted && (
              <Text style={styles.alreadyStartedIndicator}>
                Already started
              </Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={(e) => {
                e.stopPropagation();
                handlePress();
              }}
              style={styles.joinButton}
              labelStyle={{ color: colors.buttonText }}
            >
              {tab === "created" ? "View Course" : "Go to Course"}
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CourseItem;
