import * as visitorService from '../services/visitor.service.js';
import * as personalizationService from '../services/personalization.service.js';
import { success } from '../utils/apiResponse.js';

/** FE expects the session payload directly as axios res.data */
export async function startSession(req, res, next) {
  try {
    const result = await visitorService.startSession(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getSession(req, res, next) {
  try {
    const session = req.visitorSession;
    return success(res, {
      sessionId: session.id,
      token: session.token,
      visitor: {
        fullName: session.fullName,
        visitorType: session.visitorType,
        ageGroup: session.ageGroup,
        education: session.education,
      },
      createdAt: session.startedAt,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const result = await visitorService.getSessionById(req.params.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getExperience(req, res, next) {
  try {
    const experience = await visitorService.getExperience(req.visitorSession);
    return success(res, experience);
  } catch (error) {
    return next(error);
  }
}

export async function endSession(req, res, next) {
  try {
    const session = await visitorService.endSession(req.visitorSession.id);
    return success(res, session);
  } catch (error) {
    return next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const sessionId = req.params.id || req.visitorSession?.id;
    const result = await visitorService.updateProfile(sessionId, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function updateMyProfile(req, res, next) {
  try {
    const result = await visitorService.updateProfile(req.visitorSession.id, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function recordEvent(req, res, next) {
  try {
    const event = await visitorService.recordEvent(req.visitorSession, req.body, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    return success(res, event, undefined, 201);
  } catch (error) {
    return next(error);
  }
}

export async function listEvents(req, res, next) {
  try {
    const events = await visitorService.listSessionEvents(req.visitorSession.id);
    return success(res, events);
  } catch (error) {
    return next(error);
  }
}

export async function getRecommendations(req, res, next) {
  try {
    const recommendations = await personalizationService.getRecommendations(
      req.visitorSession,
      req.query.limit,
    );
    return success(res, recommendations, { count: recommendations.length });
  } catch (error) {
    return next(error);
  }
}
