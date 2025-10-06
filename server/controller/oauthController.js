import { BAD_REQUEST } from "../errorCodes.js";
import { oauthAuthentication, oauthValidation, logoutUsers, handleRefreshTokenRequest, createClientToken } from "../helper/oauthHelper.js";

export const oauthAction = async (req, res) => {
    try {
        const result = await oauthValidation(req);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({error:error.message});
    }
};
export const oauthClientAction = async (req, res) => {
  try {
    const { clientId, clientSecret } = req.body;

    if (!clientId || !clientSecret) {
      return res.status(BAD_REQUEST.code).send({ error: 'clientId and clientSecret required' });
    }

    const token = await createClientToken(clientId, clientSecret);
    res.send(token); 
  } catch (error) {
    console.error(error);
    return res.status(BAD_REQUEST.code).send({ error: error.message });
  }
};


export const oauthReAction = async (req, res) => {
    try {
        const result = await handleRefreshTokenRequest(req, res); 
        res.send(result);
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return res.status(400).send({ error: error.message });
    }
};

export const oauthToken = async (req, res) => {
    try {
        const result = await oauthAuthentication(req);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send(error.message);
    }
};
export const logoutAction = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(UNAUTHORIZED.code).send('No token provided.');
        }
        await logoutUsers(token);
        res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send(error.message);
    }
};