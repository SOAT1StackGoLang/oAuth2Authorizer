const { CognitoJwtVerifier } = require("aws-jwt-verify");

// dummy comment

// Create the verifier outside the Lambda handler (= during cold start),
// so the cache can be reused for subsequent invocations. Then, only during the
// first invocation, will the verifier actually need to fetch the JWKS.
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.CLIENT_ID,
});
exports.handler = async (event) => {  
  if (!event.headers.authorization) {
    console.log('Returning not authorized');
    return {
      isAuthorized: false,
    };
  }
  try {    
    console.log('Verifying in cognito');
    await verifier.verify(event.headers.authorization);
    
    console.log('Returning authorized');
    return {
      isAuthorized: true,
    };
  } catch (e) {
    console.log('Returning not authorized');
    console.error(e);
    return {
      isAuthorized: false,
    };
  }
};
