import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { getUserAssessmentDetails } from "@services/AssessmentService";
import { Alert } from "react-native";

export async function handleDownload(
  assessmentId: string,
  studentId: string
): Promise<void> {
  try {
    const data = await getUserAssessmentDetails(assessmentId, studentId);
    const { assessment, userProfile } = data;

    const htmlContent = `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2 { color: #333; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; }
        .question { margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        .question-text { font-weight: bold; }
        .options { margin-left: 20px; margin-top: 5px; }
        .answer { margin-left: 20px; margin-top: 5px; color: #555; }
        input[type="text"], textarea {
          width: 100%;
          padding: 5px;
          margin-top: 3px;
          border: 1px solid #aaa;
          border-radius: 3px;
          font-size: 14px;
        }
        textarea {
          resize: vertical;
          min-height: 50px;
        }
      </style>
    </head>
    <body>
      <h1>Assessment Review Sheet</h1>
      
      <div class="section">
        <h2>Student Info</h2>
        <p><span class="label">Name:</span> ${userProfile.first_name} ${
      userProfile.last_name
    }</p>
        <p><span class="label">Username:</span> ${userProfile.user_name}</p>
        <p><span class="label">Email:</span> ${userProfile.email}</p>
      </div>

      <div class="section">
        <h2>Assessment Details</h2>
        <p><span class="label">Title:</span> ${assessment.title}</p>
        <p><span class="label">Description:</span> ${assessment.description}</p>
        <p><span class="label">Instructions:</span> ${
          assessment.instructions
        }</p>
        <p><span class="label">Submitted on:</span> ${new Date(
          assessment.submissionTime
        ).toLocaleString()}</p>
      </div>

      <div class="section">
        <h2>Questions</h2>
        ${assessment.questions
          .map(
            (q: any, index: number) => `
          <div class="question">
            <div class="question-text">${index + 1}. ${q.text} (Max Score: ${
              q.score
            })</div>
            ${
              q.type === "MULTIPLE_CHOICE"
                ? `
              <div class="options">
                <div><span class="label">Options:</span></div>
                <ul>
                  ${q.options.map((opt: string) => `<li>${opt}</li>`).join("")}
                </ul>
              </div>
              <div class="answer"><span class="label">Correct Option:</span> ${
                q.correctOption
              }</div>
              <div class="answer"><span class="label">Student Answer:</span> ${q.answers
                .map((a: any) => a.selectedOption || "No answer")
                .join(", ")}</div>
              `
                : q.type === "WRITTEN_ANSWER"
                ? `
              <div class="answer"><span class="label">Sample Answer:</span> ${
                q.sampleAnswer || "N/A"
              }</div>
              <div class="answer"><span class="label">Student Answer:</span> ${q.answers
                .map((a: any) => a.answerText || "No answer")
                .join(", ")}</div>
              `
                : ""
            }
            <div class="answer"><span class="label">Score:</span><br/><input type="text"/></div>
            <div class="answer"><span class="label">Comment:</span><br/><textarea></textarea></div>
          </div>
        `
          )
          .join("")}
      </div>
    </body>
  </html>
`;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  } catch (error) {
    Alert.alert("Error", "Could not generate PDF.");
    console.error(error);
  }
}
