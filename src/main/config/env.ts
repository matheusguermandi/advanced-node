export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? "255017709763229",
    clientSecret:
      process.env.FB_CLIENT_SECRET ?? "c02b1e197ee6aec2947b193148cdaef7",
    accessToken:
      process.env.FB_ACCESS_TOKEN ??
      "EAADn7ZCAAep0BAC1nu5NtvNtzEHt5lUbZC8RSpOjp1dmZArJdHWStRfIhGG5OTPXLz1dZCPs3lADAghqhrruZB2NVX2cXm1ZCNMDITH75F6HYdcmuzp84oWwo1O7ZC84AvBuHzEDxPivsc0fYWupGoyDwfCZAWPUd3MedFp4AADpQUUHQq4TTXVeK6pktPicTxhdi114NScAzwRN5vnrGqmK",
  },
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? "",
    secret: process.env.AWS_S3_SECRET ?? "",
    bucket: process.env.AWS_S3_BUCKET ?? "",
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? "3jk24h32jk4h",
};
