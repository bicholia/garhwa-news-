import * as Sentry from '@sentry/nextjs'

// This initialization will be used once a DSN is provided via environment variables.
Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production, or using tracesSampler for finer control.
    tracesSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
})

export { Sentry }
