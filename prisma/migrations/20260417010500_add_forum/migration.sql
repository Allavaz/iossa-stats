-- CreateTable
CREATE TABLE "ForumMessage" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "votes" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "ForumMessage_pkey" PRIMARY KEY ("id")
);
