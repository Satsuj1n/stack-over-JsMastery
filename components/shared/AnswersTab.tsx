import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchProps, userId, clerkId }: Props) => {
    const results = await getUserAnswers({ userId, page: 1 });
  return (
    <>
        {results.answers.map((answer) => (
            <AnswerCard
            key={answer._id}
            _id={answer._id}
            clerkId={clerkId}
            author={answer.author}
            upvotes={answer.upvotes.length}
            question={answer.question}
            createdAt={answer.createdAt}
          />
        ))}
    </>
  )
}

export default AnswersTab