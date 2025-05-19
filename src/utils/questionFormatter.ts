import { AssesmentQuestion } from "@services/AssesmentService";

export function questionFormatter(questions: AssesmentQuestion[]) {
  questions.map((q: AssesmentQuestion) => {
    const base = {
      text: q.text,
      score: Number(q.score),
      type: q.type,
      hasImage: Boolean(q.hasImage),
    };

    if (q.type === "WRITTEN_ANSWER") {
      return {
        ...base,
        sampleAnswer: q.sampleAnswer || "",
      };
    }

    if (q.type === "MULTIPLE_CHOICE") {
      return {
        ...base,
        correctOption: q.correctOption,
        options: q.options,
      };
    }

    return q;
  });
}
