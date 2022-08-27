import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";

type Props = {
  Cat: Cat;
};
function Questions({ Cat }: Props) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [curr, setCurr] = useState<Question>(questions[0]);
  const [selected, setSelected] = useState<string>("");
  const [correctAnswered, setCorrectAnswered] = useState<Question[]>([]);
  useEffect(() => {
    setLoading(true);
    const fetchCAts = async () => {
      if (!Cat) return;
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${Cat.id}`
      );
      const data = (await response.json()) as {
        results: Question[];
        response_code: number;
      };
      setQuestions(data.results);
      setCurr(data.results[0]);
      setLoading(false);
    };
    fetchCAts();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (!curr)
    return (
      <>
        <div className="flex items-center justify-center h-screen  bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
          <div className="text-2xl font-semibold">
            You have answered all the questions!
          </div>
        </div>
      </>
    );

  const answers = [...curr.incorrect_answers];
  answers.splice(
    Math.floor(Math.random() * (answers.length + 1)),
    0,
    curr.correct_answer
  );

  const AnswerHandler = (answer: string) => {
    setSelected(answer);
    if (answer === curr.correct_answer) {
      // check if the cur is the last question
      setCurr(
        questions[
          // move to next question
          questions.indexOf(curr) + 1
        ]
      );
      setCorrectAnswered([...correctAnswered, curr]);
    }
  };

  return (
    <>
      <div className="h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
        <div className="container mx-auto">
          <div className="flex  justify-center items-center h-screen">
            <div className="bg-indigo-100 border border-indigo-700 shadow-2xl shadow-purple-500/40 p-8 text-center rounded-xl">
              <h1
                className="text-2xl font-semibold max-w-xl mx-auto"
                dangerouslySetInnerHTML={{ __html: curr.question }}
              />
              <div className="my-2 text-lg">
                Difficulty:{" "}
                <span
                  style={{
                    color:
                      curr.difficulty === "easy"
                        ? "green"
                        : curr.difficulty === "medium"
                        ? "orange"
                        : "red",
                  }}
                  className="font-semibold capitalize"
                >
                  {curr?.difficulty}
                </span>
              </div>
              <RadioGroup value={selected} onChange={AnswerHandler}>
                <div className="flex items-center justify-center gap-4 mt-8">
                  {answers?.map((answer, i) => (
                    <RadioGroup.Option
                      key={i}
                      value={answer}
                      className={
                        "bg-white  relative flex cursor-pointer rounded-lg px-6 py-3 shadow-md focus:outline-none"
                      }
                    >
                      {({ checked }) => (
                        <>
                          <span
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{ __html: answer }}
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Questions;
