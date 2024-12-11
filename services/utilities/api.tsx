import http from "../core/http";
const getApiBaseUrl = process.env.EXPO_PUBLIC_REACT_NATIVE_APP_API_BASE_URL;

if (!getApiBaseUrl) {
  throw new Error("API Base URL is not defined.");
}

const makeApiUrl = (url: string) => `${getApiBaseUrl}${url}`;

export const signUp = ({ data }: { data: Record<string, any> }) => {
  return http.post({
    url: makeApiUrl("users/register"),
    data,
  });
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
  userId,
}: {
  data: Record<string, any>;
  userId: string;
}) => {
  return http.post({
    url: makeApiUrl(`user/agent/${userId}/instance`),
    data,
  });
};

export const getAgentInstances = (userId: string) => {
  return http.get({
    url: makeApiUrl(`user/${userId}/agent/instances`),
  });
};

export const getAgentInstanceById = (instanceId: string) => {
  return http.get({
    url: makeApiUrl(`user/agent/instance/${instanceId}`),
  });
};

export const getDataByTask = (instanceId: string, task: string) => {
  return http.get({
    url: makeApiUrl(`instances/${instanceId}/task/${task}/data`),
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
