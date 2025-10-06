// helper/oauthHelper.js
import OAuth2Server from 'oauth2-server';
import oauthModel from '../model/oauthModel.js';
import clientModel from '../model/clientModel.js';
import { BAD_REQUEST, UNAUTHORIZED } from "../errorCodes.js";
import { userValidation } from '../helper/loginHelper.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

// ---------- OAuth2 Server Model Functions ----------
const getAccessToken = (token) => oauthModel.findOne({ accessToken: token }).lean();

const getClient = (clientId, clientSecret) => clientModel.findOne({ clientId, clientSecret }).lean();

const saveToken = async (token, client, user) => {
    const userId = user.userId || 'client_user_id';

    // Delete existing token for same user
    await oauthModel.deleteMany({ 'user.userId': userId });

    const tokenInstance = new oauthModel({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        client: {
            id: client.id,
            clientId: client.clientId,
        },
        user: {
            userName: user.userName,
            emailId: user.emailId || null,
            userId: userId,
            userRole: user.userRole || 'user',
            firstTimeUser: user.firstTimeUser || false,
            forgotPassword: user.forgotPassword || false,
        },
    });

    const savedToken = await tokenInstance.save();
    delete savedToken._id;
    delete savedToken.__v;
    return savedToken;
};

const getUser = async (userName, password) => {
    try {
        const user = await userValidation(userName, password);
       
        return {
            userId: user._id,
            userName: user.userName,
            emailId: user.emailId,
            role: user.role,
        };
    } catch (err) {
        console.error('Error in getUser:', err);
        return false;
    }
};

const getRefreshToken = (refreshToken) => oauthModel.findOne({ refreshToken }).lean();

const revokeToken = (token) => oauthModel.deleteOne({ refreshToken: token.refreshToken }).lean();

const oauthtoken = new OAuth2Server({
    model: {
        getAccessToken,
        getClient,
        saveToken,
        getUser,
        getRefreshToken,
        revokeToken,
    },
});

export const createClientToken = async (clientId, clientSecret) => {
    const client = await clientModel.findOne({ clientId, clientSecret }).lean();
    if (!client) throw new Error('Invalid client credentials');

    const user = {
        userName: 'client_user',
        emailId: null,
        userId: 'client_user_id',
        userRole: 'client',
        firstTimeUser: false,
        forgotPassword: false,
    };

    const accessToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');

    const tokenObj = {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: new Date(Date.now() + 20 * 60 * 1000),
        refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    const savedToken = await saveToken(tokenObj, client, user);
    return savedToken;
};

// ---------- OAuth Password Grant ----------
export const oauthValidation = async (req) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(req);

    try {
        const tokenInfo = await oauthtoken.token(request, response);
        return tokenInfo;
    } catch (error) {
        return { error: error.message };
    }
};

// ---------- OAuth Authentication Middleware ----------
export const oauthAuthentication = async (req, res, next) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
        const token = await oauthtoken.authenticate(request, response);
        req.authUser = token.user;
        next();
    } catch (err) {
        return res.status(UNAUTHORIZED.code).send({ error: err.message });
    }
};

// ---------- Refresh Token Handler ----------
export const handleRefreshTokenRequest = async (req, res) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
        const tokenInfo = await oauthtoken.token(request, response);
        res.json(tokenInfo);
    } catch (error) {
        res.status(error.code || 500).json({ error: error.message });
    }
};

// ---------- Logout User ----------
export const logoutUsers = async (token) => {
    const result = await oauthModel.findOneAndDelete({ accessToken: token });
    if (!result) {
     
        return true;
    }
    return true;
};
