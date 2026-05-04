import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

const PAGE_SIZE = 10;

export async function pushMessage(message) {
  const client = await clientPromise;
  const collection = client.db().collection(process.env.DB_COLLECTION_FORUM);
  return collection.insertOne(message);
}

export async function getMessages(page?: number) {
  const client = await clientPromise;
  const collection = client.db().collection(process.env.DB_COLLECTION_FORUM);
  const baseQuery = collection.aggregate([
    { $sort: { date: -1 } },
    {
      $addFields: {
        voteCounts: {
          $let: {
            vars: {
              voteArray: { $objectToArray: "$votes" }
            },
            in: {
              likes: {
                $size: {
                  $filter: {
                    input: "$$voteArray",
                    as: "vote",
                    cond: { $eq: ["$$vote.v", "like"] }
                  }
                }
              },
              dislikes: {
                $size: {
                  $filter: {
                    input: "$$voteArray",
                    as: "vote",
                    cond: { $eq: ["$$vote.v", "dislike"] }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]);
  if (page) {
    return baseQuery
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray();
  } else {
    return baseQuery.limit(PAGE_SIZE).toArray();
  }
}

export async function getPageCount() {
  const client = await clientPromise;
  const collection = client.db().collection(process.env.DB_COLLECTION_FORUM);
  const count = await collection.countDocuments();
  return Math.ceil(count / PAGE_SIZE);
}

export async function pushVote(
  id: ObjectId,
  vote: "like" | "dislike",
  email: string
) {
  const client = await clientPromise;
  const collection = client.db().collection(process.env.DB_COLLECTION_FORUM);
  const message = await collection.findOne({ _id: id });
  if (!message) {
    throw new Error("Message not found");
  }
  const votes = message.votes || {};
  if (email in votes && votes[email] === vote) {
    delete votes[email];
  } else {
    votes[email] = vote;
  }
  return collection.updateOne({ _id: message._id }, { $set: { votes } });
}

export async function getMessage(id: string) {
  const client = await clientPromise;
  const collection = client.db().collection(process.env.DB_COLLECTION_FORUM);
  return collection.findOne({ _id: new ObjectId(id) });
}
