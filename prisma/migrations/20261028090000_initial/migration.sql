CREATE TABLE "User" ("id" SERIAL NOT NULL, "name" TEXT NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Event" ("id" SERIAL NOT NULL, "title" TEXT NOT NULL, CONSTRAINT "Event_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Registration" ("id" SERIAL NOT NULL, "eventId" INTEGER NOT NULL, "userId" INTEGER NOT NULL, CONSTRAINT "Registration_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Registration_eventId_userId_key" ON "Registration"("eventId", "userId");
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
