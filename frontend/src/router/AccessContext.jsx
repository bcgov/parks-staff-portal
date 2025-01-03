import PropTypes from "prop-types";
import { createContext } from "react";
import getEnv from "@/config/getEnv";

export const AccessContext = createContext();

export function AccessProvider({ children, auth }) {
  // Decode the token to get the user's roles
  const roles = [];
  const accessToken = auth?.user?.access_token;
  const clientId = getEnv("VITE_OIDC_CLIENT_ID"); // "staff-portal"

  if (accessToken) {
    const payload = accessToken.split(".").at(1);
    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload);
    const payloadRoles = parsedPayload?.resource_access?.[clientId].roles ?? [];

    roles.push(...payloadRoles);
  }

  // @TODO: implement a fine-grained permission check here
  function checkAccess(requiredRole) {
    // Super admin can access everything
    if (roles.includes("DOOT_SUPER_ADMIN")) return true;

    return roles.includes(requiredRole);
  }

  return (
    <AccessContext.Provider value={{ checkAccess, roles }}>
      {children}
    </AccessContext.Provider>
  );
}

// prop validation
AccessProvider.propTypes = {
  children: PropTypes.node,
  auth: PropTypes.object,
};
