import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { getAssessmentById } from "@services/AssessmentService";
import { Alert } from "react-native";

export async function handleDownload(
  assessmentId: string,
  studentId: string
): Promise<void> {
  try {
    const data = await getAssessmentById(assessmentId, studentId);
    const assessment = data;

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
      <h1>Assessment: ${assessment.title}</h1>
      <div class="section">
        <h2>Instructions</h2>
        <p>${assessment.instructions}</p>
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
              q.type === "MULTIPLE_CHOICE" && q.options?.length
                ? `
              <div class="options">
                <div><span class="label">Options:</span></div>
                <ul>
                  ${q.options.map((opt: string) => `<li>${opt}</li>`).join("")}
                </ul>
              </div>
              `
                : ""
            }
            ${
              q.type === "WRITTEN_ANSWER"
                ? `
              <div class="answer"><span class="label">Your Answer:</span><br/><textarea></textarea></div>
              `
                : q.type === "FILE_ATTACHMENT"
                ? `
              <div class="answer"><span class="label">Upload your file:</span><br/><input type="text" placeholder="Attach file (not available in PDF)"/></div>
              `
                : q.type === "MULTIPLE_CHOICE"
                ? `
              <div class="answer"><span class="label">Your Answer:</span><br/><input type="text" /></div>
              `
                : ""
            }
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
