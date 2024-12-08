ALTER TABLE public."NewsletterSubscribers"
ALTER COLUMN subscribed_at TYPE TIMESTAMP;

ALTER TABLE public."NewsletterSubscribers"
ALTER COLUMN unsubscribed_at TYPE TIMESTAMP;