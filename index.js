const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Create the verifier outside the Lambda handler (= during cold start),
// so the cache can be reused for subsequent invocations. Then, only during the
// first invocation, will the verifier actually need to fetch the JWKS.
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_rMynssSb6",
  tokenUse: "access",
  clientId: "17epfms5np5l92dsp4jk68m34d",
});
exports.handler = async (event) => {
  console.log('event.headers.Authorization', event.headers.Authorization);
  
  if (!event.headers.Authorization) {
    console.log('Returning not authorized');
    return {
      isAuthorized: false,
    };
  }
  try {    
    console.log('Verifying in cognito');
    await verifier.verify(event.headers.Authorization);
    
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
