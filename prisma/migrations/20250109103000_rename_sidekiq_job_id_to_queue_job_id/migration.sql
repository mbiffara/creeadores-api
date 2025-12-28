-- Rename sidekiq job reference to a generic queue job id.
ALTER TABLE "Collaboration" RENAME COLUMN "sidekiqJobId" TO "queueJobId";
