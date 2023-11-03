const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Create the verifier outside the Lambda handler (= during cold start),
// so the cache can be reused for subsequent invocations. Then, only during the
// first invocation, will the verifier actually need to fetch the JWKS.
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_ZKZPzWYFr",
  tokenUse: "access",
  clientId: "7kgaqt1ne3k01q149v4bdehuf7",
});
exports.handler = async (event) => {
  if (!event.headers.Authorization) {
    return {
      isAuthorized: false,
    };
  }
  try {
    await verifier.verify(event.headers.Authorization);
    return {
      isAuthorized: true,
    };
  } catch (e) {
    console.error(e);
    return {
      isAuthorized: false,
    };
  }
};