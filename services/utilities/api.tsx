import http from "../core/http";
const getApiBaseUrl = process.env.EXPO_PUBLIC_REACT_NATIVE_APP_API_BASE_URL;
if (!getApiBaseUrl) {
  throw new Error("API Base URL is not defined.");
}
console.log(getApiBaseUrl);

const makeApiUrl = (url: string) => `${getApiBaseUrl}${url}`;

export const signUp = ({ data }: { data: Record<string, any> }) => {
  return http.post({
    url: makeApiUrl("users/register"),
    data,
  });
};

export const UpdateUserDetails = ({
  data,
  userId,
}: {
  data: Record<string, any>;
  userId: string;
}) => {
  return http.put({ url: makeApiUrl(`users/${userId}`), data });
};

export const logIn = ({ data }: { data: Record<string, any> }) => {
  return http.post({
    url: makeApiUrl("users/login"),
    data,
  });
};

export const logout = () => {
  return http.post({
    url: makeApiUrl("users/logout"),
  });
};

export const refreshToken = ({ data }: { data: Record<string, any> }) => {
  return http.post({
    url: makeApiUrl("users/refresh-token"),
    data,
  });
};

export const getAllAgents = ({ params }: { params?: any } = {}) => {
  return http.get({
    url: makeApiUrl("agents"),
    params,
  });
};

export const createAgentInstance = ({
  data,
  agentId,
}: {
  data: Record<string, any>;
  agentId: string;
}) => {
  return http.post({
    url: makeApiUrl(`user/agent/${agentId}/instance`),
    data,
  });
};

export const createAgentInstance1 = ({
  data,
  agentId,
}: {
  data: Record<string, any>;
  agentId: string;
}) => {
  return http.post({
    url: makeApiUrl(`user/agent/${agentId}/instance1`),
    data,
  });
};

export const deleteAgentInstance = (instance_id: string) => {
  return http.delete({
    url: makeApiUrl(`user/agent/instance/${instance_id}`),
  });
};

export const getAgentInstances = ({
  userId,
  params,
}: {
  userId: string;
  params: any;
}) => {
  return http.get({
    url: makeApiUrl(`user/${userId}/agent/instances`),
    params,
  });
};

export const getAgentInstanceById = ({
  instanceId,
  params,
}: {
  instanceId: string;
  params: any;
}) => {
  return http.get({
    url: makeApiUrl(`user/agent/instance/${instanceId}`),
    params,
  });
};

export const getDataByTask = ({
  instanceId,
  task,
  params,
}: {
  instanceId: string;
  task: string;
  params?: Record<string, any>;
}) => {
  return http.get({
    url: makeApiUrl(`instances/${instanceId}/task/${task}/data`),
    params,
  });
};

export const completeTask = ({
  data,
  instace_id,
}: {
  data: Record<string, any>;
  instace_id: string;
}) => {
  return http.post({
    url: makeApiUrl(`instance/${instace_id}/task/complete`),
    data,
  });
};

export const submitDeviceDetails = ({
  data,
}: {
  data: Record<string, any>;
}) => {
  return http.post({
    url: makeApiUrl("user/device/register"),
    data,
  });
};

export const sendFeedback = ({
  data,
  user_id,
}: {
  data: Record<string, any>;
  user_id: string;
}) => {
  return http.post({
    url: makeApiUrl(`user/${user_id}/feedback`),
    data,
  });
};

export const getScalFeedback = ({
  instance_id,
  taskKey,
  params,
}: {
  instance_id: string;
  taskKey: string;
  params: any;
}) => {
  return http.get({
    url: makeApiUrl(`instance/${instance_id}/task/${taskKey}/feedbacks`),
    params,
  });
};

export const submitScalFeedback = ({
  feedback_id,
  data,
}: {
  feedback_id: string;
  data: Record<string, any>;
}) => {
  return http.put({
    url: makeApiUrl(`feedback/${feedback_id}`),
    data,
  });
};

export const getOnboardingQuestions = ({
  user_id,
  params,
}: {
  user_id: string;
  params: any;
}) => {
  return http.get({
    url: makeApiUrl(`user/${user_id}/onboardings`),
    params,
  });
};

export const submitOnboardingQuestions = ({
  id,
  data,
}: {
  id: string;
  data: Record<string, any>;
}) => {
  return http.put({
    url: makeApiUrl(`user/onboarding/${id}`),
    data,
  });
};

export const getAllNotifications = ({
  user_id,
  params,
}: {
  user_id: string;
  params: any;
}) => {
  return http.get({
    url: makeApiUrl(`user/${user_id}/notifications`),
    params,
  });
};
