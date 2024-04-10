-- CreateTable
CREATE TABLE "Adds" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Adds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Adds" ADD CONSTRAINT "Adds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
