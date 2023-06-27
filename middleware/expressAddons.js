export default function setNoSniffHeader(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
}
